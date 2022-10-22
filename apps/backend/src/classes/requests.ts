import { ParamsDictionary, Query } from "express-serve-static-core";

import { Request } from "express";

export interface TypedRequestBody<T> extends Request {
    body: T;
}

export interface TypedRequestQuery<T extends Query> extends Request {
    query: T;
}

export interface TypedRequestParams<T extends ParamsDictionary> extends Request {
    params: T;
}

export interface TypedRequestQueryBody<T extends Query, U> extends Request {
    query: T;
    body: U;
}

export interface TypedRequestQueryParams<T extends Query, U extends ParamsDictionary>
    extends Request {
    query: T;
    params: U;
}

export interface TypedRequestParamsBody<T extends ParamsDictionary, U> extends Request {
    params: T;
    body: U;
}

export interface TypedRequest<T extends Query, P extends ParamsDictionary, U> extends Request {
    body: U;
    query: T;
    params: P;
}
