import {
    AppShell,
    Center,
    Navbar,
    Stack,
    Tooltip,
    UnstyledButton,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import {
    IconAtom2,
    IconDashboard,
    IconHome2,
    IconLogout,
    IconUserCircle,
    TablerIcon,
} from "@tabler/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { useLogoutMutation } from "../../store/api/auth/authApi";

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor })
                .background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
    },
}));

interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    path?: string;
    onClick?(): void;
}

const NavbarLink = ({ icon: Icon, label, active, onClick }: NavbarLinkProps) => {
    const { classes, cx } = useStyles();
    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton
                onClick={onClick}
                className={cx(classes.link, { [classes.active]: active })}
            >
                <Icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
};

const navLinks = [
    { icon: IconHome2, label: "Home", path: "/home" },
    { icon: IconDashboard, label: "Dashboard", path: "/dashboard" },
];

const ProtectedNavbar = () => {
    const [active, setActive] = useState(0);
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    const links = useMemo(() => {
        return navLinks.map((link, index) => (
            <NavbarLink
                {...link}
                key={link.label}
                active={index === active}
                onClick={() => {
                    if (link.path) {
                        navigate(link.path);
                    }
                    setActive(index);
                }}
            />
        ));
    }, [active]);

    return (
        <Navbar width={{ base: 80 }} p="md">
            <Center>
                <IconAtom2 color={theme.fn.primaryColor()} size={30} />
            </Center>
            <Navbar.Section grow mt={30}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <NavbarLink icon={IconUserCircle} label="Account" />
                    <NavbarLink
                        icon={IconLogout}
                        label="Logout"
                        onClick={async () => await logout()}
                    />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
};

export const ProtectedLayout = () => {
    return (
        <AppShell fixed navbar={<ProtectedNavbar />}>
            <Outlet />
        </AppShell>
    );
};
