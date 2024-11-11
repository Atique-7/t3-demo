import { account } from "@/lib/appwrite";
import { Account, ID, Models } from "appwrite";

class UserManager {
  private account: Account;

  constructor() {
    this.account = account;
  }

  // Create an account with email and password
  async createUser(email: string, password: string, name?: string) {
    try {
      const user = await this.account.create(ID.unique(), email, password, name);
      console.log("User created:", user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  // Get current logged-in user's details
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      console.log("Current user details:", user);
      return user;
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  }

  // Update the current user's name
  async updateName(name: string) {
    try {
      const updatedUser = await this.account.updateName(name);
      console.log("Name updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating name:", error);
    }
  }

  // Update email for current user
  async updateEmail(email: string, password: string) {
    try {
      const updatedUser = await this.account.updateEmail(email, password);
      console.log("Email updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating email:", error);
    }
  }

   // Update the current user's preferences
   async updatePreferences(preferences: Record<string, any>) {
    try {
      const updatedUser = await this.account.updatePrefs(preferences);
      console.log("Preferences updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  }

  // Update current user's password
  async updatePassword(password: string, oldPassword?: string) {
    try {
      const updatedUser = await this.account.updatePassword(password, oldPassword);
      console.log("Password updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }

  // Log out
  async logout() {
    try {
      await this.account.deleteSession("current");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Initiate password recovery
  async initiatePasswordRecovery(email: string, redirectUrl: string) {
    try {
      await this.account.createRecovery(email, redirectUrl);
      console.log("Password recovery initiated");
    } catch (error) {
      console.error("Error initiating password recovery:", error);
    }
  }

  // Complete password recovery
  async completePasswordRecovery(userId: string, secret: string, newPassword: string) {
    try {
      await this.account.updateRecovery(userId, secret, newPassword);
      console.log("Password recovery completed");
    } catch (error) {
      console.error("Error completing password recovery:", error);
    }
  }
}
