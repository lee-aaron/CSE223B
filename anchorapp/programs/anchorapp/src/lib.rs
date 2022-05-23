use anchor_lang::prelude::*;

declare_id!("6scwiUMW8MxfJdsXZG878DEm8dLh8ZDPNBezmC3HeZwn");

#[program]
pub mod anchorapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
