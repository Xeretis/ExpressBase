import {
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    PasswordInput,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { GeneralError, GeneralErrorResponse } from "shared";

import { Link } from "react-router-dom";
import { handleFormErrors } from "../../utils/forms";
import { useForm } from "@mantine/form";
import { useLoginMutation } from "../../store/api/auth/authApi";

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

export const Login = () => {
    const { classes } = useStyles();
    const [login, { isLoading }] = useLoginMutation();
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await login({
                ...values,
            }).unwrap();
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
                case "password":
                    form.setFieldValue("password", "");
                    form.setFieldError("password", error.message);
                    break;
            }
        }
    };

    return (
        <Center className={classes.container}>
            <form className={classes.form} onSubmit={(event) => submit(event)}>
                <Title order={1} size="h2" align="center">
                    Login
                </Title>
                <TextInput
                    required
                    type="email"
                    mt="xs"
                    label="Email"
                    {...form.getInputProps("email")}
                />
                <PasswordInput
                    required
                    mt="xs"
                    label="Password"
                    {...form.getInputProps("password")}
                />
                <Box className={classes.spacedContainer} mt="md">
                    <Checkbox
                        label="Remmeber me"
                        {...form.getInputProps("remember", { type: "checkbox" })}
                    />
                    <Anchor component={Link} size="sm" to="/" align="center">
                        Forgot your password?
                    </Anchor>
                </Box>
                <Box mt="md" className={classes.spacedContainer}>
                    <Box>
                        <Text size="sm">
                            Don't have an account yet?{" "}
                            <Anchor inherit component={Link} to="/register">
                                Register
                            </Anchor>
                        </Text>
                        <Anchor size="sm" component={Link} to="/">
                            Back to the home page
                        </Anchor>
                    </Box>
                    <Button type="submit" loading={isLoading}>
                        Login
                    </Button>
                </Box>
            </form>
        </Center>
    );
};
