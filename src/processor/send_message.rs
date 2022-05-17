use crate::error::MsgError;

use solana_program::{
  account_info::{next_account_info, AccountInfo},
  clock::Clock,
  entrypoint::ProgramResult,
  program::{invoke, invoke_signed},
  program_error::ProgramError,
  pubkey::Pubkey,
  rent::Rent,
  system_instruction::{create_account, transfer},
  system_program,
  sysvar::Sysvar,
};

pub struct Accounts<T> {
  pub system_program: &T,

  pub sender: &T,

  pub receiver: &T,

  pub thread: &T,

  pub receiver_profile: &T,

  pub message: &T,

  pub sol_vault: &T
}

pub(crate) fn process(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  params: Params
) -> ProgramResult {

}