use anchor_lang::prelude::*;

declare_id!("AB7UQ9XjLKKGYRuqZqb4ZXgVMEs3KpftkNsYLBfKohm3");
// declare_id!("6scwiUMW8MxfJdsXZG878DEm8dLh8ZDPNBezmC3HeZwn");

const MESSAGE_SIZE: usize = 256;
const NAME_SIZE: usize = 32;

#[program]
mod anchorapp {
    use super::*;

    pub fn claim_space(ctx: Context<ClaimSpace>, claimer: Pubkey, name: String) -> Result<()> {
        // Cannot claim for other people
        require_keys_eq!(ctx.accounts.user.key(), claimer, SpaceError::NoProxyUser);

        // Convert name to array
        let bytes: &[u8] = name.as_bytes();
        require_gte!(NAME_SIZE as usize, bytes.len(), SpaceError::NameTooLong);
        let mut name_bytes: [u8; NAME_SIZE] = [0; NAME_SIZE];
        name_bytes[..bytes.len()].clone_from_slice(bytes);

        // Try to claim space
        ctx.accounts.my_space.claim_space(claimer, name_bytes)
    }

    pub fn post_message(ctx: Context<PostMessage>, message: String) -> Result<()> {
        // Get mut space
        let space = &mut ctx.accounts.my_space;

        require_keys_eq!(space.owner, ctx.accounts.user.key(), SpaceError::NoPermission);

        // Convert message to array
        let bytes: &[u8] = message.as_bytes();
        require_gte!(MESSAGE_SIZE, bytes.len(), SpaceError::MessageTooLong);
        let mut message_bytes: [u8; MESSAGE_SIZE] = [0; MESSAGE_SIZE];
        message_bytes[..bytes.len()].clone_from_slice(bytes);

        // Try to claim space
        ctx.accounts.my_space.set_message(message_bytes)
    }

    pub fn set_name(ctx: Context<SetName>, name: String) -> Result<()> {
        // Get mut space
        let space = &mut ctx.accounts.my_space;

        require_keys_eq!(space.owner, ctx.accounts.user.key(), SpaceError::NoPermission);

        // Convert message to array
        let bytes: &[u8] = name.as_bytes();
        require_gte!(NAME_SIZE, bytes.len(), SpaceError::NameTooLong);
        let mut name_bytes: [u8; NAME_SIZE] = [0; NAME_SIZE];
        name_bytes[..bytes.len()].clone_from_slice(bytes);

        // Try to set name
        ctx.accounts.my_space.set_name(name_bytes)
    }

    pub fn get_message(ctx: Context<GetMessage>) -> Result<([u8; MESSAGE_SIZE])> {
        ctx.accounts.my_space.get_message()
    }
    pub fn get_name(ctx: Context<GetName>) -> Result<([u8; NAME_SIZE])> {
        ctx.accounts.my_space.get_name()
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

#[derive(Accounts)]
pub struct SetName<'info> {
    #[account(mut)]
    pub my_space: Account<'info, Space>,
    pub user: Signer<'info>
}

#[derive(Accounts)]
pub struct GetMessage<'info> {
    pub my_space: Account<'info, Space>
}

#[derive(Accounts)]
pub struct GetName<'info> {
    pub my_space: Account<'info, Space>
}

#[account]
pub struct Space {
    pub owner: Pubkey,
    pub name: [u8; NAME_SIZE],
    pub message: [u8; MESSAGE_SIZE],
}

impl Space {
    pub const MAXIMUM_SIZE: usize = 32 + 1*NAME_SIZE + 1*MESSAGE_SIZE;

    pub fn claim_space(&mut self, owner: Pubkey, name: [u8; NAME_SIZE]) -> Result<()> {
        // Space already claimed - already checked by account

        // Otherwise, claim space and initialize
        self.owner = owner;
        self.name = name;
        self.message = [0; MESSAGE_SIZE];

        Ok(())
    }

    pub fn get_name(&self) -> Result<[u8; NAME_SIZE]> {
        Ok(self.name.clone())
    }

    pub fn get_message(&self) -> Result<[u8; MESSAGE_SIZE]> {
        Ok(self.message.clone())
    }

    pub fn set_name(&mut self, name: [u8; NAME_SIZE]) -> Result<()> {
        self.name = name;
        Ok(())
    }

    pub fn set_message(&mut self, message: [u8; MESSAGE_SIZE]) -> Result<()> {
        self.message = message;
        Ok(())
    }

    pub fn delete_message(&mut self) -> Result<()> {
        self.message = [0; MESSAGE_SIZE];
        Ok(())
    }
}

#[error_code]
pub enum SpaceError {
    NoPermission,
    NameTooLong,
    MessageTooLong,
    NoProxyUser,
}