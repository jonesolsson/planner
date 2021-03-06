import * as React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, FormikActions } from 'formik';
import * as Yup from 'yup';
import { Flex, Input, Button } from '../../components/layout';
import { UserStore, userStore } from '../../stores/';
import { Redirect } from 'react-router';

const loginFormValidation = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required')
});

const InputWrap = styled.div`
  margin-bottom: 15px;
`;

interface ILoginProps {
  userStore: UserStore;
  redirect: boolean;
}

const ErrorMessage = styled.div`
  margin-top: 5px;
  color: #ad5b5b;
`;

const Login: React.FC<ILoginProps> = () => {
  const [redirectTo, setRedirectTo] = React.useState<string>();

  React.useEffect(() => {
    userStore.authenticate().then(user => {
      if (user) {
        setRedirectTo('/');
      }
    });
  }, []);

  const handleSubmit = async (
    data: Planner.Users.Forms.RegisterValues,
    {
      setSubmitting,
      setErrors,
      resetForm
    }: FormikActions<Planner.Users.Forms.RegisterValues>
  ) => {
    setSubmitting(true);

    try {
      const response = await userStore.login(data);
      if (response.status && response.status === 200) {
        setSubmitting(false);
        resetForm();
        setRedirectTo('/');
      } else {
        setErrors(response.message);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  if (redirectTo && typeof redirectTo === 'string') {
    return <Redirect to={redirectTo} />;
  }

  return (
    <Flex justifyContent='center'>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{ username: 'orrstam@itiden.se', password: '' }}
        validationSchema={loginFormValidation}
      >
        <Form style={{ width: '60%', alignSelf: 'center' }}>
          <Field name='username'>
            {({ field, form }) => (
              <InputWrap>
                <Input
                  type='email'
                  {...field}
                  placeholder='Email'
                  width='100%'
                  fontSize="16px"
                  p="15px"
                />
                <ErrorMessage>
                  {form.touched.username && form.errors.username}
                </ErrorMessage>
              </InputWrap>
            )}
          </Field>
          <Field name='password'>
            {({ field, form }) => (
              <InputWrap>
                <Input
                  type='password'
                  {...field}
                  placeholder='Password'
                  width='100%'
                  fontSize="16px"
                  p="15px"
                />
                {form.errors && form.errors.length ? (
                  <ErrorMessage>{form.errors}</ErrorMessage>
                ) : null}
                <ErrorMessage>
                  {form.touched.password && form.errors.password}
                </ErrorMessage>
              </InputWrap>
            )}
          </Field>
          <Button width="100%" p="15px 0" type='submit'>Login</Button>
        </Form>
      </Formik>
    </Flex>
  );
};

export default Login;
