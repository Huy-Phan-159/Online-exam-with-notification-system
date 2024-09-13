
export class ResetPasswordTemplate {
  private resetLink:string
  constructor(resetLink: string) {
    this.resetLink=resetLink
  }
  getTemplate():string{
    return `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${this.resetLink}">Reset Password</a></p>`;
  }
}