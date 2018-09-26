import { observable, action, transaction } from 'mobx';
import api from '../services/api';

export default class TaskStore {
  @observable taskList: Planner.Tasks.Task[] = [];

  @action
  public addTask(task: Planner.Tasks.Task): void {
    this.taskList.push(task);
  }

  @action
  public removeTask(id: string): void {
    this.taskList = this.taskList.filter(task => task._id !== id);
  }

  async createTask(task: Planner.Tasks.Task): Promise<any> {
    try {
      const response = await api.post('/', task);
      this.addTask(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteTask(id: string): Promise<any> {
    try {
      const response = await api.delete('/', { data: { id } });
      this.removeTask(id);

      return response;
    } catch (responseError) {
      console.log(responseError);
    }
  }

  async fetch(): Promise<any> {
    try {
      const data = await api.get('/');
      transaction(() => data.data.forEach((item: Planner.Tasks.Task) => this.addTask(item)));
    } catch(error) {
      return Promise.reject(error);
    }
  }
}

export const taskStore = new TaskStore();