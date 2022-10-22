import {
    Anchor,
    Box,
    Button,
    Center,
    PasswordInput,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { GeneralError, GeneralErrorResponse } from "shared";
import { useLoginMutation, useRegisterMutation } from "../../store/api/auth/authApi";

import { Link } from "react-router-dom";
import { handleFormErrors } from "../../utils/forms";
import { useForm } from "@mantine/form";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "25vw",

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            width: "35vw",
        },

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            width: "45vw",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "65vw",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            width: "85vw",
        },
    },
    spacedContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));

export const Register = () => {
    const { classes } = useStyles();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const form = useForm({
        initialValues: {
            email: "",
            username: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await register({
                ...values,
            }).unwrap();

            try {
                await login({
                    email: values.email,
                    password: values.password,
                    remember: true,
                }).unwrap();
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            handleFormErrors(err, handleErrors);
        }
    });

    const handleErrors = (errors: GeneralError[]) => {
        for (const error of errors) {
            switch (error.path[1]) {
                case "email":
                    form.setFieldError("email", error.message);
                    break;
                case "username":
                    form.setFieldError("username", error.message);
                    break;
                case "password":
                    form.setFieldError("password", error.message);
                    break;
                case "passwordConfirmation":
                    form.setFieldError("passwordConfirmation", error.message);
                    break;
            }
        }
    };

    return (
        <Center className={classes.container}>
            <form className={classes.form} onSubmit={(event) => submit(event)}>
                <Title order={1} size="h2" align="center">
                    Register
                </Title>
                <TextInput
                    required
                    type="email"
                    mt="xs"
                    label="Email"
                    {...form.getInputProps("email")}
                />
                <TextInput required mt="xs" label="Username" {...form.getInputProps("username")} />
                <PasswordInput
                    required
                    mt="xs"
                    label="Password"
                    {...form.getInputProps("password")}
                />
                <PasswordInput
                    required
                    mt="xs"
                    label="Confirm password"
                    {...form.getInputProps("passwordConfirmation")}
                />
                <Box className={classes.spacedContainer} mt="md">
                    <Box>
                        <Text size="sm">
                            Alredy have an account?{" "}
                            <Anchor inherit component={Link} to="/login">
                                Log in
                            </Anchor>
                        </Text>
                        <Anchor size="sm" component={Link} to="/">
                            Back to the home page
                        </Anchor>
                    </Box>
                    <Button type="submit" loading={isRegisterLoading || isLoginLoading}>
                        Register
                    </Button>
                </Box>
            </form>
        </Center>
    );
};
