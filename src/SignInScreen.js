import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { signIn, signUp } from "../lib/auth";

function SignInScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signUpSubmit = async () => {
    const { email, password } = form;
    const info = { email, password };
    try {
      const { user } = await signUp(info);
      console.log(user);
      Alert.alert("회원가입에 성공했습니다.");
    } catch (e) {
      Alert.alert("회원가입에 실패하였습니다.");
    }
  };

  const signInSubmit = async () => {
    const { email, password } = form;
    const info = { email, password };
    try {
      const { user } = await signIn(info);
      console.log(user);
      Alert.alert("로그인에 성공했습니다.");
    } catch (e) {
      Alert.alert("로그인에 실패하였습니다.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setForm({ ...form, email: text })}
        value={form.email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setForm({ ...form, password: text })}
        value={form.password}
      />
      <Button title="Sign Up" onPress={signUpSubmit} />
      <Button title="Sign In" onPress={signInSubmit} />
    </View>
  );
}

export default SignInScreen;
