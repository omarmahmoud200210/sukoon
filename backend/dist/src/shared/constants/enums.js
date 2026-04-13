export { Priority } from "@prisma/client";
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MODERATOR"] = "MODERATOR";
})(UserRole || (UserRole = {}));
export var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    AuthErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    AuthErrorCode["TOKEN_INVALID"] = "TOKEN_INVALID";
    AuthErrorCode["EMAIL_NOT_VERIFIED"] = "EMAIL_NOT_VERIFIED";
    AuthErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    AuthErrorCode["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
})(AuthErrorCode || (AuthErrorCode = {}));
