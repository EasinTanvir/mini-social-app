import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
} & TextInputProps;

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: FormInputProps<T>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <TextInput
              style={[styles.input, fieldState.error && styles.errorBorder]}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              {...props}
            />

            {fieldState.error && (
              <Text style={styles.error}>{fieldState.error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
  },

  errorBorder: {
    borderColor: "red",
  },

  error: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
});
