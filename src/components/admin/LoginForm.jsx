import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useStore } from '../../stores';

function LoginForm() {
  const { register, getValues } = useForm();
  const { setIsLogin } = useStore((state) => ({ setIsLogin: state.setIsLogin }));

  const handleLoginClick = () => {
    const { admin_email, admin_pw } = getValues();
    if (process.env.REACT_APP_ADMIN_EMAIL === admin_email && process.env.REACT_APP_ADMIN_PW === admin_pw) {
      setIsLogin('main');
    } else alert('⚠️ 관리자만 접근 가능한 페이지입니다.');
  };

  return (
    <Container onSubmit={handleLoginClick}>
      <Heading>로그인</Heading>
      <Label>
        아이디
        <Input placeholder="이메일" {...register('admin_email')} />
      </Label>
      <Label>
        비밀번호
        <Input placeholder="비밀번호" {...register('admin_pw')} />
      </Label>
      <Button>로그인</Button>
    </Container>
  );
}

export default LoginForm;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const Heading = styled.h1`
  margin-top: 268px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.64px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.32px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  width: 336px;
  height: 56px;
  padding: 16px 24px;

  border-radius: 38px;
  border: 1px solid #525252;
  outline: none;

  &:focus {
    border: 1px solid #3686ff;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  width: 336px;
  height: 56px;
  padding: 16px 24px;

  border-radius: 38px;
  background: #3686ff;

  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.32px;
`;
