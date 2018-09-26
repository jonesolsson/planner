import * as React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FormikActions, FormikErrors } from 'formik';
import TaskStore from '../stores/TaskStore';
import { inject } from 'mobx-react';

const Wrapper = styled.div``;
const InputWrap = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding-left: 5px;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  padding-left: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 0;
`;

export interface IAddTaskFormSubmitValues {
  title: string,
  text: string
}

export interface IAddTaskFormProps {
  taskStore?: TaskStore,
  onSubmit?: (e: IAddTaskFormSubmitValues) => Promise<any>,
}

@inject('taskStore')
export default class AddTaskForm extends React.Component<IAddTaskFormProps> {
  handleSubmit = async (
    data: IAddTaskFormSubmitValues,
    { setSubmitting, setErrors, resetForm }: FormikActions<IAddTaskFormSubmitValues>
  ) => {
      setSubmitting(true);
      const response = await this.props.taskStore!.createTask(data);

      if (response && response.error) {
        setErrors(response.error);
      } else {
        resetForm();
      }

      setSubmitting(false);
  };

  validate(values: IAddTaskFormSubmitValues) {
    let errors: FormikErrors<any> = {};

    Object.keys(values).forEach(key => {
      if (!values[key]) {
      errors[key] = 'Required';
      }
    });

    return errors;
  }

  public render() {
    const initialValues: IAddTaskFormSubmitValues = {
      title: '',
      text: ''
    };

    return(
      <Wrapper>
        <Formik onSubmit={this.handleSubmit} initialValues={initialValues} validate={this.validate}>
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Field name="title">
              {({field, form}) => (
                <InputWrap>
                  <Input type="text" {...field} placeholder="Title"/> { form.touched.title && form.errors.title }
                </InputWrap>
              )}
            </Field>
            <Field name="text">
              {({field, form}) => (
                <InputWrap>
                  <Textarea {...field} rows={10} cols={40} placeholder="Text">{}</Textarea>{ form.touched.text && form.errors.text }
                </InputWrap>
              )}
            </Field>
            <Button disabled={isSubmitting}>Submit</Button>
          </Form>
        )}
        </Formik>
      </Wrapper>
    )
  }
}