use solana_program::{decode_error::DecodeError, program_error::ProgramError};
use thiserror::Error;

#[derive(Error, Debug, Clone)]
pub enum MsgError {
  #[error("Account does not exist")]
  AccountDoesNotExist,
}

impl From<MsgError> for ProgramError {
  fn from(err: MsgError) -> Self {
    ProgramError::Custom(err as u32)
  }
}

impl<T> DecodeError<T> for MsgError {
  fn type_of() -> &'static str {
    "MsgError"
  }
}