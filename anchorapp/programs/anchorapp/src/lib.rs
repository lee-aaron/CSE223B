use anchor_lang::prelude::*;
use std::str;

declare_id!("AB7UQ9XjLKKGYRuqZqb4ZXgVMEs3KpftkNsYLBfKohm3");

#[program]
mod anchorapp {
    use super::*;

    pub fn claim_space(ctx: Context<ClaimSpace>, claimer: Pubkey, name: String) -> Result<()> {
        // Convert name to array
        let bytes: &[u8] = name.as_bytes();
        require_gte!(32 as usize, bytes.len(), SpaceError::NameTooLong);
        let mut name_bytes: [u8; 32] = [0; 32];
        name_bytes[..bytes.len()].clone_from_slice(bytes);

        // Try to claim space
        ctx.accounts.my_space.claim_space(claimer, name_bytes)
    }

    pub fn post_message(ctx: Context<PostMessage>, issuer: Pubkey, message: String) -> Result<()> {
        // Get mut space
        let space = &mut ctx.accounts.my_space;

        require_keys_eq!(space.owner, ctx.accounts.user.key(), SpaceError::NoPermission);

        // Convert message to array
        let bytes: &[u8] = message.as_bytes();
        require_gte!(256 as usize, bytes.len(), SpaceError::MessageTooLong);
        let mut message_bytes: [u8; 256] = [0; 256];
        message_bytes[..bytes.len()].clone_from_slice(bytes);

        // Try to claim space
        ctx.accounts.my_space.set_message(issuer, message_bytes)
    }
}

#[derive(Accounts)]
pub struct ClaimSpace<'info> {
    #[account(init, payer = user, space = 8 + Space::MAXIMUM_SIZE)]
    pub my_space: Account<'info, Space>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct PostMessage<'info> {
    #[account(mut)]
    pub my_space: Account<'info, Space>,
    pub user: Signer<'info>
}

#[account]
pub struct Space {
    pub owner: Pubkey,
    pub name: [u8; 32],
    pub message: [u8; 256],
}

impl Space {
    pub const MAXIMUM_SIZE: usize = 32 + 1*32 + 1*256;

    pub fn claim_space(&mut self, owner: Pubkey, name: [u8; 32]) -> Result<()> {
        // Space already claimed
        // require_keys_eq!(self.owner, owner, SpaceError::AlreadyClaimed);

        // Otherwise, claim space and initialize
        self.owner = owner;
        self.name = name;
        self.message = [0; 256];

        Ok(())
    }

    pub fn get_name(&self) -> String {
        str::from_utf8(&self.name).unwrap().to_string()
    }

    pub fn get_data(&self) -> String {
        str::from_utf8(&self.message).unwrap().to_string()
    }

    pub fn set_name(&mut self, issuer: Pubkey, name: [u8; 32]) -> Result<()> {
        require_keys_eq!(self.owner, issuer, SpaceError::NoPermission);
        self.name = name;
        Ok(())
    }

    pub fn set_message(&mut self, issuer: Pubkey, message: [u8; 256]) -> Result<()> {
        require_keys_eq!(self.owner, issuer, SpaceError::NoPermission);
        self.message = message;
        Ok(())
    }

    pub fn delete_message(&mut self, issuer: Pubkey) -> Result<()> {
        require_keys_eq!(self.owner, issuer, SpaceError::NoPermission);
        self.message = [0; 256];
        Ok(())
    }
}

#[error_code]
pub enum SpaceError {
    AlreadyClaimed,
    NoPermission,
    NameTooLong,
    MessageTooLong,
}