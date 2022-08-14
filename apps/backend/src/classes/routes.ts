import { Router } from "express";

export interface Routes {
    router: Router;
    basePath?: string;
}
