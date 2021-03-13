const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET: secret } = require("../config/secrets");
const { JWT_SECRET_RESET: reset_secret } = require("../config/secrets");
const axios = require("axios");
const qs = require("qs");
const {
  sendResetPasswordEmail,
  contactEmail,
  sendVerifyAccount,
  sendSuccess,
  sendAccountCancellation,
} = require("../services/EmailService");
const { getAccessToken } = require("../services/accessToken");
const moment = require('moment')

module.exports = {
  Query: {
    // Used to get data from "traders" table only
    async tradersUsers(_, { input }, ctx) {
      let meObject = typeof "object";
      if (!input) {
        return ctx.Traders.getDataSessions();
      }
      const keys = Object.keys(input);
      if (meObject && !keys.length) {
        return ctx.Traders.getTraders();
      }
      let dataFromDataBase;
      for (let i = 0; i < keys.length; i++) {
        if (i === 0) dataFromDataBase = await ctx.Traders.getTraders();
        dataFromDataBase = dataFromDataBase.filter(
          filterBy => filterBy[keys[i]] === input[keys[i]]
        );
      }
      return dataFromDataBase;
    },
    // Used to get data from "parsed_data" and "traders" table joined
    async sessionsData(_, { input }, ctx) {
      let meObject = typeof "object";
      if (!input) {
        return ctx.Traders.getDataSessions();
      }
      const keys = Object.keys(input);
      if (meObject && !keys.length) {
        return ctx.Traders.getDataSessions();
      }
      let dataFromDataBase;
      for (let i = 0; i < keys.length; i++) {
        if (i === 0) dataFromDataBase = await ctx.Traders.getDataSessions();
        dataFromDataBase = dataFromDataBase.filter(
          filterBy => filterBy[keys[i]] === input[keys[i]]
        );
      }
      return dataFromDataBase;
    },
    databankUsers(_, args, ctx) {
      return ctx.Users.findAll();
    },

    databankUser(_, args, ctx) {
      return ctx.Users.findOne({ email: args.input.email });
    },
    getGraphLabels(_, args, ctx) {
      return ctx.CatLabels.all();
    }
  },
  Mutation: {
    async register(_, { input }, ctx) {
      let found = undefined;
      try {
        found = await ctx.Users.findByEmail(input.email);
        if (found) {
          return { email: "Sorry, this email has already been taken." };
        } else {
          const hashedPassword = bcrypt.hashSync(input.password, 8);
          const [newlyCreatedUser] = await ctx.Users.create({
            ...input,
            password: hashedPassword
          });
          const token = generateResetToken(newlyCreatedUser);
          const url = `https://www.tradeinsights.sautiafrica.org/email-verification/?resetToken=${token}`;
          await sendVerifyAccount(input, url);
          return newlyCreatedUser;
        }
      } catch (err) {
        return err;
      }
    },
    async login(_, { input }, ctx) {
      let user = input;
      // if password is okay
      // get user
      // make token using the tier and other user stuff
      // return user and token
      if (await validPassword(user, ctx)) {
        const registeredUser = await ctx.Users.findByEmail(user.email);
        delete registeredUser.password;
        const token = generateToken(registeredUser);
        return { ...registeredUser, token };
      } else {
        return "Invalid email or password.";
      }
    },
    editUser(_, { input }, ctx) {
      // The first arg to EditedUserOrError becomes the returned input value
      return input;
    },
    validateEmail(_, { input }, ctx) {
      // The first arg to EmailValidate becomes the returned input value
      return input;
    },
    resetPassword(_, { input }, ctx) {
      // The first arg to EmailValidate becomes the returned input value
      return input;
    },
    deleteUser(_, { input }) {
      // The first arg to DeletedUserOrError becomes the returned input value
      return input;
    },
    updateUserToExpired(_, { input }, ctx) {
      // The first arg to EditedUserOrError becomes the returned input value
      return input;
    },
    addPaypalPlan(_, { input }, ctx) {
      return input;
    },
    sendResetPassword(_, { input }, ctx) {
      return input;
    },
    async emailByContact(_, { input }, ctx) {
      return contactEmail(input);
    }
  },
  UpdateUserToExpired: {
    async __resolveType(user, ctx) {
      const theUser = await ctx.Users.findByEmail(user.email);
      const { subscription_id, id } = theUser;

      const access_token = await getAccessToken();
      axios.defaults.headers.common = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      };

      if (access_token) {
        let users_subscription;
        let userCancelled;
        try {
          // run to get end of billing cycle
          users_subscription = await axios.get(
            `${process.env.paypalUrl}v1/billing/subscriptions/${subscription_id}`
          );
          // cancel sub
          const cancelSub = await axios.post(
            `${process.env.paypalUrl}v1/billing/subscriptions/${subscription_id}/cancel`,
            { timeout: 3 }
          );
          console.log("past  cancelSub", cancelSub.data);
          // if status cancelled, success
          if (cancelSub) {
            userCancelled = await axios.get(
              `${process.env.paypalUrl}v1/billing/subscriptions/${subscription_id}`
            );
          }
        } catch (error) {
          return error;
        }

        // we know payment is cancelled, set the end of billing cycle
        if (userCancelled.data.status === "CANCELLED") {
          theUser.p_next_billing_time =
            users_subscription.data.billing_info.next_billing_time;

            let mDate = moment(Number(users_subscription.data.billing_info.next_billing_time));
            const expDate = mDate.format("M/D/YYYY")
            // email cancellation notice
            sendAccountCancellation(user.email, expDate)

        }
        let error = user;
        await ctx.Users.updateById(id, theUser);
        if (theUser.p_next_billing_time) {
          return "DatabankUser";
        } else {
          error.message =
            "Something went wrong, please try again or contact Sauti, let them know you were unable to cancel your account.";
          return "Error";
        }
      } else {
        error.message = `problem with auth`;
        return "Error";
      }
    }
  },
  EditedUserOrError: {
    async __resolveType(user, ctx, info) {
      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 8);
        user.verification_code = null;
      }
      user.verified_email = 1;
      const updated = await ctx.Users.updateById(user.id, user);
      if (updated) {
        return "DatabankUser";
      } else {
        let error = user;
        error.message = `There was an issue updating the user with id ${user.id}`;
        return "Error";
      }
    }
  },
  EmailValidate: {
    async __resolveType(user, ctx) {
      user.verified_email = 1;
      const updated = await ctx.Users.updateById(user.id, user);
      await sendSuccess(user, "verify");
      if (updated) {
        return "DatabankUser";
      } else {
        let error;
        error.message = `There was an issue updating the user with id ${user.id}`;
        return "Error";
      }
    }
  },
  PasswordReset: {
    async __resolveType(user, ctx) {
      user.password = bcrypt.hashSync(user.password, 8);
      user.verified_email = 1;
      user.verification_code = null;
      const updated = await ctx.Users.updateById(user.id, user);
      await sendSuccess(user, "password");
      if (updated) {
        return "DatabankUser";
      } else {
        let error;
        error.message = `There was an issue updating the user with id ${user.id}`;
        return "Error";
      }
    }
  },
  DeletedUserOrError: {
    async __resolveType(user, ctx) {
      const deleted = await ctx.Users.removeById(user.id, user);
      if (deleted) {
        return "DatabankUser";
      } else {
        let error = user;
        error.message = `There was an issue deleting user with id ${user.id}`;
        return "Error";
      }
    }
  },
  AddPaypalPlanOrError: {
    async __resolveType(user, ctx) {
      const theUser = await ctx.Users.findByEmail(user.email);
      const { subscription_id, id } = theUser;

      const access_token = await getAccessToken();
      axios.defaults.headers.common = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      };
      if (access_token) {
        try {
          const users_subscription = await axios.get(
            `${process.env.paypalUrl}v1/billing/subscriptions/${subscription_id}`
          );
          const userPlanID = users_subscription.data.plan_id;

          const users_planIdInformation = await axios.get(
            `${process.env.paypalUrl}v1/billing/plans/${userPlanID}`
          );
          const planIDName = users_planIdInformation.data.name;
          // Adding plan id name into the DB

          theUser.paypal_plan = planIDName;
          const planAdded = await ctx.Users.updateById(id, theUser);
          if (planAdded) {
            return "DatabankUser";
          }
        } catch (err) {
          return err;
        }
      } else {
        let error = user;
        error.message = "There has been a problem";
        return "Error";
      }
    }
  },
  ResetPasswordOrError: {
    async __resolveType(user, ctx) {
      let userObj;
      try {
        userObj = await ctx.Users.findByEmail(user.email);
      } catch (e) {
        return e;
      }
      const { id, email } = userObj;
      let userUpdate = { id: id, email: email };
      // generating token that expires in 1 hour for the password URL + the token needs to have current user email on it
      const resetTokenGeneration = generateResetToken(userUpdate);
      const url = `https://www.tradeinsights.sautiafrica.org/password-verification/?resetToken=${resetTokenGeneration}`;
      if (userObj) {
        let generateNumber = Math.floor(Math.random() * 90000) + 10000;
        userUpdate.verification_code = generateNumber;
        await ctx.Users.updateById(id, userUpdate);
        await sendResetPasswordEmail(userUpdate, generateNumber, url);
        return "DatabankUser";
      } else {
        let error = user;
        error.message = "There has been a problem";
        return "Error";
      }
    }
  }
  // TODO: Add a DatabankUser resolver to return the updated fields
};

/**
 * Helpers
 */

// this helps us know who the verification code is for
function generateResetToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };
  const options = {
    expiresIn: "1h"
  };
  return jwt.sign(payload, reset_secret, options);
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    tier: user.tier
  };
  const options = {
    expiresIn: "12h"
  };
  return jwt.sign(payload, secret, options);
}

function validPassword(user, ctx) {
  let { email, password } = user;
  if (email && password) {
    return ctx.Users.findByEmail(email)
      .then(user => {
        return user && bcrypt.compareSync(password, user.password)
          ? true
          : false;
      })
      .catch(error => {
        return false;
      });
  } else {
    return false;
  }
}
