import { prisma } from '../config/db';
import { logAudit } from '../utils/auditLogger';
import { TaskStatus, UserRole } from '@prisma/client';
import { ProjectHealthService } from './project-health.service';

export interface CreateTaskInput {
  title: string;
  description?: string;
  milestoneId?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null;
  dueDate?: string | null;
  isClientVisible?: boolean;
  orderIndex?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  milestoneId?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null;
  dueDate?: string | null;
  isClientVisible?: boolean;
  orderIndex?: number;
}

export class TaskService {
  /**
   * List tasks for a project with client visibility isolation.
   */
  static async listTasks(projectId: string, userRole: UserRole) {
    const isClient = userRole === UserRole.CLIENT;

    return prisma.task.findMany({
      where: {
        projectId,
        ...(isClient ? { isClientVisible: true } : {}),
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, role: true, avatarUrl: true },
        },
        milestone: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /**
   * Create a new task on a project (Admin only).
   */
  static async createTask(projectId: string, input: CreateTaskInput, _user: any, req?: any) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');

    const taskCount = await prisma.task.count({ where: { projectId } });
    if (taskCount >= 100) {
      throw new Error('Project task limit reached (maximum 100 active tasks per project).');
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: input.title,
        description: input.description,
        milestoneId: input.milestoneId || null,
        status: input.status || TaskStatus.TODO,
        assigneeId: input.assigneeId || null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        isClientVisible: input.isClientVisible ?? false,
        orderIndex: input.orderIndex ?? taskCount,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        milestone: { select: { id: true, title: true } },
      },
    });

    if (task.status === TaskStatus.WAITING_ON_CLIENT) {
      await ProjectHealthService.recalculateProjectHealth(projectId, req);
    }

    return task;
  }

  /**
   * Update a task (status transition, assignee, visibility, order).
   */
  static async updateTask(taskId: string, input: UpdateTaskInput, user: any, req?: any) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');

    const prevStatus = task.status;
    const isStatusChanged = input.status && input.status !== prevStatus;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: input.title !== undefined ? input.title : undefined,
        description: input.description !== undefined ? input.description : undefined,
        milestoneId: input.milestoneId !== undefined ? input.milestoneId : undefined,
        status: input.status !== undefined ? input.status : undefined,
        assigneeId: input.assigneeId !== undefined ? input.assigneeId : undefined,
        dueDate: input.dueDate !== undefined ? (input.dueDate ? new Date(input.dueDate) : null) : undefined,
        isClientVisible: input.isClientVisible !== undefined ? input.isClientVisible : undefined,
        orderIndex: input.orderIndex !== undefined ? input.orderIndex : undefined,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        milestone: { select: { id: true, title: true } },
      },
    });

    // Audit log only for key transitions (WAITING_ON_CLIENT or DONE) to avoid noise
    if (
      isStatusChanged &&
      (input.status === TaskStatus.WAITING_ON_CLIENT ||
        prevStatus === TaskStatus.WAITING_ON_CLIENT ||
        input.status === TaskStatus.DONE)
    ) {
      await logAudit({
        userId: user.id,
        action: 'TASK_STATUS_CHANGED',
        entityType: 'Task',
        entityId: taskId,
        changes: {
          projectId: task.projectId,
          taskTitle: task.title,
          previousStatus: prevStatus,
          newStatus: input.status,
        },
        req,
      });

      // Recalculate project health if waiting on client
      await ProjectHealthService.recalculateProjectHealth(task.projectId, req);
    }

    return updatedTask;
  }

  /**
   * Delete a task.
   */
  static async deleteTask(taskId: string, _user: any, req?: any) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');

    await prisma.task.delete({ where: { id: taskId } });

    if (task.status === TaskStatus.WAITING_ON_CLIENT) {
      await ProjectHealthService.recalculateProjectHealth(task.projectId, req);
    }

    return { success: true, taskId };
  }
}
