import React from 'react';
import SignUpForm from '../components/signUp';

const SignUpStudent = () => <SignUpForm role="student" />;
const SignUpTeacher = () => <SignUpForm role="teacher" />;
const SignUpAdmin = () => <SignUpForm role="admin" />;

export { SignUpStudent, SignUpTeacher, SignUpAdmin };
