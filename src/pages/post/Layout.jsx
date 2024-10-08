import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import StepBar from '../../components/business/StepBar';
import Agreement from '../../components/business/Agreement';
import TitleLayout from '../../components/business/TitleLayout';
import RequiredPost from '../../components/business/RequiredPost';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import OptionalPost from '../../components/business/OptionalPost';
import PersonalPost from '../../components/business/PersonalPost';
import PayPost from '../../components/business/PayPost';
import toast from 'react-hot-toast';

const STEP_NAME = ['약관동의', '필수항목 작성', '선택항목 작성', '기본정보 입력', '결제'];

function Layout() {
  const [step, setStep] = useState(STEP_NAME[0]);
  const methods = useForm();

  const autoSaveFunc = () => {
    const { input1, input2, input3, input4, input5, name, email, birth, phoneNumber, title } = methods.getValues();
    window.localStorage.setItem(
      'ai-plan',
      JSON.stringify({
        input1,
        input2,
        input3,
        input4,
        input5,
        name,
        email,
        birth,
        phoneNumber,
        title,
      })
    );
    toast.success('자동저장 완료', { style: { fontSize: '14px', fontWeight: '500' } });
  };

  const handleNextStep = () => {
    if (step !== STEP_NAME[0]) autoSaveFunc();
    return setStep(STEP_NAME[STEP_NAME.indexOf(step) + 1]);
  };

  const STEP_COMPONENT = {
    약관동의: <Agreement handleNextStep={handleNextStep} />,
    '필수항목 작성': <RequiredPost handleNextStep={handleNextStep} />,
    '선택항목 작성': <OptionalPost handleNextStep={handleNextStep} />,
    '기본정보 입력': <PersonalPost handleNextStep={handleNextStep} />,
    결제: <PayPost handlePrevStep={(stepNum) => setStep(STEP_NAME[stepNum])} />,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const autoSave = setInterval(autoSaveFunc, 30 * 1000);
    if (step === STEP_NAME[0] && step === STEP_NAME[4]) clearInterval(autoSave);
    return () => clearInterval(autoSave);
  }, [step]);

  return (
    <Wrapper>
      <Sidebar />
      <FormProvider {...methods}>
        <Container>
          <TitleLayout type={step === STEP_NAME[4] ? '결제' : '작성'}>
            <StepWrapper>
              {STEP_COMPONENT[step]}
              <StepBar curStep={STEP_NAME.indexOf(step)} />
            </StepWrapper>
          </TitleLayout>
        </Container>
      </FormProvider>
    </Wrapper>
  );
}

export default Layout;

const Wrapper = styled.div`
  display: flex;
  width: 1440px;
`;

const Container = styled.div`
  width: calc(1440px - 296px);
  padding: 96px 80px;
`;

const StepWrapper = styled.div`
  margin-top: 40px;

  display: flex;
  justify-content: space-between;
  gap: 48px;
`;
