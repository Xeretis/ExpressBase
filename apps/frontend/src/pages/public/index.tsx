import { Button, Center, Group, Title, createStyles } from "@mantine/core";

import { Link } from "react-router-dom";

const useSyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
    },
}));

export const Index = () => {
    const { classes } = useSyles();

    return (
        <Center className={classes.container}>
            <Title order={1}>Home page</Title>
            <Group mt="md">
                <Button component={Link} to="/login">
                    Login
                </Button>
                <Button component={Link} to="/register">
                    Register
                </Button>
            </Group>
        </Center>
    );
};
