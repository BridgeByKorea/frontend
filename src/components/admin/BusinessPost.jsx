import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FilterContent from '../commons/FilterContent';
import { useStore } from '../../stores';
import { useForm } from 'react-hook-form';
import { funnelNextBtn } from '../../styles/button';
import { PROXY } from '../../constants/api';
import PageLoading from '../commons/PageLoading';

const INPUT_VALUE = [
  {
    label: '사업명',
    placeholder: '사업명을 입력해주세요',
    inputType: 'text',
    registerName: 'title',
  },
  {
    label: '주관기관명 입력',
    placeholder: '주관기관명을 입력해주세요',
    inputType: 'text',
    registerName: 'agent',
  },
  {
    label: '지원마감일',
    placeholder: null,
    inputType: 'date',
    registerName: 'deadline',
  },
  {
    label: '지원 페이지 링크',
    placeholder: 'url을 입력해주세요',
    inputType: 'url',
    registerName: 'link',
  },
];

function BusinessPost({ type = 'post' }) {
  const { register, getValues, setValue } = useForm();
  const { selectedList, setSelectedList, setIsLogin } = useStore((state) => ({
    selectedList: state.selectedFilter,
    setSelectedList: state.setSelectedFilter,
    setIsLogin: state.setIsLogin,
  }));
  const [isLoading, setIsLoading] = useState(false);

  const reqBusiness = async (type) => {
    const { id, title, deadline, agent, link } = getValues();
    const url = PROXY + (type === 'post' ? '/api/business' : `/api/business/${id}`);
    const data = {
      title,
      types: selectedList,
      deadline,
      agent,
      link,
    };
    try {
      const res = await fetch(url, {
        method: type === 'post' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.status > 201) {
        const errorObj = await res.json();
        throw Error(errorObj.message);
      }
      alert(`${type === 'post' ? '등록' : '수정'} 완료!`);
      setIsLogin('edit_list');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) reqBusiness(type);
  }, [isLoading]);

  useEffect(() => {
    if (type === 'post') {
      window.sessionStorage.clear();
      setSelectedList([]);
    }
    if (type === 'edit') {
      const defaultValue = JSON.parse(window.sessionStorage.getItem('admin_edit'));
      setValue('id', defaultValue.id);
      setValue('title', defaultValue.title);
      setValue('agent', defaultValue.agent);
      setValue('deadline', defaultValue.deadline);
      setValue('link', defaultValue.link);
      setSelectedList([...defaultValue.types]);
    }
  }, []);

  return (
    <Container>
      <input hidden {...register('id')} />
      {INPUT_VALUE.map((input) => (
        <Label key={input.registerName}>
          {input.label}
          <Input placeholder={input.placeholder} type={input.inputType} {...register(`${input.registerName}`)} />
        </Label>
      ))}
      <Label>
        지원사업 유형 &<br />
        주관기관 분류
        <FilterWrapper>
          <FilterContent />
        </FilterWrapper>
      </Label>
      <BtnWrapper>
        <SubmitBtn onClick={() => setIsLoading(true)} disabled={isLoading} $disabled={isLoading}>
          {isLoading ? '업로드중' : '업로드'}
        </SubmitBtn>
      </BtnWrapper>
      {isLoading && <PageLoading />}
    </Container>
  );
}

export default BusinessPost;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 16px;
  font-weight: 500;
  line-height: 150%; /* 24px */
  letter-spacing: -0.32px;
`;

const Input = styled.input`
  width: 80%;
  padding: 16px 24px;

  border-radius: 8px;
  border: 1px solid #b8b9ba;
  background: #fff;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterWrapper = styled.div`
  width: 80%;
`;

const SubmitBtn = styled.button`
  ${funnelNextBtn}
  height: 64px;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
