import { Request, Response, NextFunction } from "express";
import passport from "passport";
import validator from "validator";
import User, { IUser } from "../models/User";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    returnTo?: string;
  }
}

export const getLogin = (req: Request, res: Response): void => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

export const postLogin = (req: Request, res: Response, next: NextFunction): void => {
  const validationErrors: { msg: string }[] = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors.map(error => error.msg));
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err: Error, user: IUser, info: { message: string }) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", [info.message]);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", ["Success! You are logged in."]);
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.log("Error: Failed to destroy the session during logout.", err);
        return res.redirect("/");
      }
      req.user = undefined;
      res.redirect("/");
    });
  });
};

export const getSignup = (req: Request, res: Response): void => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

export const postSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const validationErrors: { msg: string }[] = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors.map(error => error.msg));
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", [
        "Account with that email address or username already exists.",
      ]);
      return res.redirect("../signup");
    }

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/profile");
    });
  } catch (err) {
    return next(err);
  }
};