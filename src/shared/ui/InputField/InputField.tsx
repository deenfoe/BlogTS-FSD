import React from 'react'
import styled from 'styled-components'
import { FieldValues, UseFormRegister, Path } from 'react-hook-form'

interface InputProps {
  $hasError: boolean // Проп для отображения ошибки
}

interface InputFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  placeholder?: string
  register: UseFormRegister<T>
  errorMessage?: string
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

const InputFieldContainer = styled.div`
  margin-bottom: 12px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`

const Input = styled.input<InputProps>`
  height: 40px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  padding: 8px 12px;
  transition: border-color 0.3s;
  font-family: 'Roboto';

  &:hover {
    border: 1px solid #484848;
  }

  &:focus {
    border: 1px solid #1890ff; /* Цвет рамки при фокусе */
    outline: none;
  }

  ${({ $hasError }) =>
    $hasError &&
    `
    border: 1px solid red;
  `}
`

const ErrorText = styled.p`
  margin: 0;
  padding: 0;
  color: red;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  font-family: 'Roboto';
`

function InputField<T extends FieldValues>({
  label,
  type = 'text',
  name,
  placeholder,
  register,
  errorMessage,
  onInput,
}: InputFieldProps<T>) {
  return (
    <InputFieldContainer>
      <Label>
        {label}
        <Input
          type={type}
          // name={name}
          placeholder={placeholder}
          {...register(name)}
          onInput={onInput}
          $hasError={!!errorMessage}
        />
      </Label>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </InputFieldContainer>
  )
}

InputField.defaultProps = {
  placeholder: '',
  errorMessage: '',
  onInput: undefined,
  type: 'text',
}

export default InputField
