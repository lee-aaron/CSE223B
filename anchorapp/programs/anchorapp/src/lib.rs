use anchor_lang::prelude::*;

declare_id!("AB7UQ9XjLKKGYRuqZqb4ZXgVMEs3KpftkNsYLBfKohm3");
// declare_id!("6scwiUMW8MxfJdsXZG878DEm8dLh8ZDPNBezmC3HeZwn");

const DATA_SIZE: usize = 992;   // 1024-32
const NUM_INODES: usize = 31;   // 992/32

#[program]
mod anchorapp {
    use super::*;

    // Data block operations
    pub fn create_data_block(ctx: Context<CreateBlock>, claimer: Pubkey) -> Result<()> {
        require_keys_eq!(ctx.accounts.user.key(), claimer, SpaceError::NoProxyUser);
        ctx.accounts.my_space.create_block(claimer, false)
    }

    pub fn set_data(ctx: Context<SetData>, data: Vec<u8>) -> Result<()> {
        // Get mut space
        let space = &mut ctx.accounts.my_space;
        require_keys_eq!(space.owner, ctx.accounts.user.key(), SpaceError::NoPermission);

        // Check size
        let size = data.len();
        require_gte!(DATA_SIZE, size, SpaceError::TooMuchData);

        // Update data
        ctx.accounts.my_space.set_data(data)
    }

    // Inode block operations
    pub fn create_inode_block(ctx: Context<CreateBlock>, claimer: Pubkey) -> Result<()> {
        require_keys_eq!(ctx.accounts.user.key(), claimer, SpaceError::NoProxyUser);
        ctx.accounts.my_space.create_block(claimer, true)
    }

    pub fn set_direct_blocks(ctx: Context<SetData>, data_blocks: Vec<Pubkey>) -> Result<()> {
        // Get mut space
        let space = &mut ctx.accounts.my_space;
        require_keys_eq!(space.owner, ctx.accounts.user.key(), SpaceError::NoPermission);

        // Check size
        let size = data_blocks.len();
        require_gte!(NUM_INODES-1, size, SpaceError::TooManyInodes);
        ctx.accounts.my_space.set_direct_blocks(data_blocks)
    }

    pub fn set_next_inode_block(ctx: Context<SetData>, inode: Option<Pubkey>) -> Result<()> {
        // Get mut space
        let space = &mut ctx.accounts.my_space;
        require_keys_eq!(space.owner, ctx.accounts.user.key(), SpaceError::NoPermission);
        ctx.accounts.my_space.set_next_inode_block(inode)
    }
}

#[derive(
    AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq,
)]
pub enum Content {
    DATA { data: [u8; DATA_SIZE]},
    INODE{ inodes: [Option<Pubkey>; NUM_INODES]},
}

#[account]
pub struct Block {
    pub owner: Pubkey,
    pub is_inode: bool,         // Take 1 byte
    pub size: u16,              // Max frame size is 4KB = 2^12
    pub content: Content,
}

#[derive(Accounts)]
pub struct CreateBlock<'info> {
    #[account(init, payer = user, space = 8 + Block::SIZE)]
    pub my_space: Box<Account<'info, Block>>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub my_space: Box<Account<'info, Block>>,
    pub user: Signer<'info>
}

impl Block {
    pub const SIZE: usize = 32 + 1 + 2 + (1 + (1+32)*NUM_INODES);

    pub fn create_block(&mut self, owner: Pubkey, is_inode: bool) -> Result<()> {
        self.owner = owner;
        self.size = 0;
        self.is_inode = is_inode;
        if is_inode {
            self.content = Content::INODE{inodes: [None; NUM_INODES]};
        } else {
            self.content = Content::DATA{data: [0; DATA_SIZE]};
        }
        Ok(())
    }

    pub fn set_data(&mut self, new_data: Vec<u8>) -> Result<()> {
        require!(!self.is_inode, SpaceError::NotDataBlock);
        require_gte!(DATA_SIZE, new_data.len(), SpaceError::TooMuchData);

        if let Content::DATA{data: _} = self.content {
            let mut result = [0; DATA_SIZE];
            result[..new_data.len()].clone_from_slice(&new_data[..]);
            self.content = Content::DATA{data: result};
            self.size = new_data.len() as u16;
        }

        Ok(())
    }

    pub fn set_direct_blocks(&mut self, new_inodes: Vec<Pubkey>) -> Result<()> {
        require!(self.is_inode, SpaceError::NotInodeBlock);
        require_gte!(NUM_INODES-1, new_inodes.len(), SpaceError::TooManyInodes);

        if let Content::INODE{inodes} = self.content {
            let mut result = [None; NUM_INODES];
            let temp: Vec<Option<Pubkey>> = new_inodes
                .into_iter()
                .map(|b| Some(b))
                .collect();
            self.size = temp.len() as u16;
            
            // preserve next block pointer
            result[0] = inodes[0];
            result[1..(self.size+1) as usize].clone_from_slice(&temp);

            self.content = Content::INODE{inodes: result};
        }

        Ok(())
    }

    pub fn set_next_inode_block(&mut self, inode: Option<Pubkey>) -> Result<()> {
        require!(self.is_inode, SpaceError::NotInodeBlock);

        if let Content::INODE{inodes} = self.content {
            let mut new_inodes = [None; NUM_INODES];
            new_inodes[0] = inode;
            new_inodes[1..NUM_INODES].clone_from_slice(&inodes[1..]);
            self.content = Content::INODE{inodes: new_inodes};
        }

        Ok(())
    }
}

#[error_code]
pub enum SpaceError {
    NoPermission,
    TooMuchData,
    TooManyInodes,
    NoProxyUser,
    NotDataBlock,
    NotInodeBlock,
}