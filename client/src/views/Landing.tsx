import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { getWeek } from '../services/api';
import * as moment from 'moment';
import styled from 'styled-components';
import TasksList from '../components/TasksList'
import { TaskStore, TypeStore } from '../stores/';

const Wrapper = styled.div``;

interface LandingViewProps {
  taskStore?: TaskStore,
  typeStore: TypeStore
  match: any
}

@inject('taskStore', 'typeStore')
@observer
export default class Landing extends React.Component<LandingViewProps> {
  public componentDidMount(): void {
    this.initialFetch();
  }

  public initialFetch() {
    this.props.taskStore!.fetch();
    this.props.typeStore.fetch();
  }

  public render() {
    const tasks = this.props.taskStore!.taskList;

    return (
      <Wrapper>
        <h2>Week: { getWeek(moment()) }</h2>
        <TasksList tasks={tasks.slice()} types={this.props.typeStore.types.slice()} />
      </Wrapper>
    )
  }
}
