import { intersection, map, size, uniqBy } from 'lodash';
import { ReactNode } from 'react';
import { useAppSelector } from 'src/store/hooks';
import Module from 'src/types/Module';
import Permission from 'src/types/Permission';
import Role from 'src/types/Role';
import Task from 'src/types/Task';
import Work from 'src/types/Work';

interface ConditionalCallbackProps {
  view: ReactNode;
  isTrue: boolean;
  roles: string[];
  permissions: string[];
  modules: string[];
  tasks: string[];
}

class Conditional {
  private view: ReactNode;
  private condition: boolean;

  private roles: string[];
  private permissions: string[];
  private modules: string[];
  private tasks: string[];

  public constructor(view: ReactNode, roles: Role[], permissions: Permission[], modules: Module[], tasks: Task[]) {
    this.view = view;
    this.condition = true;
    this.roles = uniqBy(roles, role => role.type?.code).map(role => role.type?.code);
    this.permissions = permissions.map(permission => permission.code);
    this.modules = modules.map(module => module.code);
    this.tasks = tasks.filter(task => !task.roles || size(intersection(this.roles, map(task.roles, item => item.code))) > 0).map(task => task.code);
  }

  public withRole(role: string) {
    this.condition = this.condition && this.roles.includes(role);
    return this;
  }

  public orWithRole(role: string) {
    this.condition = this.condition || this.roles.includes(role);
    return this;
  }

  public withPermission(permission: string) {
    this.condition = this.condition && this.permissions.includes(permission);
    return this;
  }

  public orWithPermission(permission: string) {
    this.condition = this.condition || this.permissions.includes(permission);
    return this;
  }

  public withModule(module: string) {
    this.condition = this.condition && this.modules.includes(module);
    return this;
  }

  public orWithModule(module: string) {
    this.condition = this.condition || this.modules.includes(module);
    return this;
  }

  public withTask(task: string) {
    this.condition = this.condition && this.tasks.includes(task);
    return this;
  }

  public orWithTask(task: string) {
    this.condition = this.condition || this.tasks.includes(task);
    return this;
  }

  public when(condition: boolean) {
    this.condition = this.condition && condition;
    return this;
  }

  public orWhen(condition: boolean) {
    this.condition = this.condition || condition;
    return this;
  }

  public render() {
    return this.condition ? <>{this.view}</> : undefined;
  }

  public return(expression: unknown) {
    return this.condition ? expression : undefined;
  }

  public execute(callback: (props: ConditionalCallbackProps) => unknown) {
    return this.condition ? callback({
      view: this.view,
      isTrue: this.condition,
      roles: this.roles,
      permissions: this.permissions,
      tasks: this.tasks,
      modules: this.modules
    }) : undefined;
  }
}

const useConditionalView = (status?: Work) => {
  const user = useAppSelector(state => state.global.user);

  const view = (tsx: ReactNode) => new Conditional(
    tsx,
    user?.roles || [],
    user?.permissions || [],
    user?.modules || [],
    status?.tasks || []
  );

  const conditional = () => new Conditional(
    null,
    user?.roles || [],
    user?.permissions || [],
    user?.modules || [],
    status?.tasks || []
  );

  return { view, conditional };
};

export default useConditionalView;