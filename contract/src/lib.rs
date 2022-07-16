use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::json_types::{U128, U64};
use near_sdk::{env, near_bindgen, BorshStorageKey, AccountId, Promise, Balance, log};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::env::STORAGE_PRICE_PER_BYTE;

#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    Record
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Record {
    id: U64,
    sender: AccountId,
    message: String,
    donated_value: U128,
    created_at: u64
}


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    records: UnorderedMap<u64, Record>,
    last_record_id: u64
}

impl Default for Welcome {
    fn default() -> Self {
        Self {
            records: UnorderedMap::new(StorageKey::Record),
            last_record_id: 0u64
        }
    }
}

#[near_bindgen]
impl Welcome {
    #[payable]
    pub fn create_record(&mut self, message: String) -> Promise {
        let account_id = env::predecessor_account_id();
        let deposit = env::attached_deposit();
        let storage_used = env::storage_usage();

        let record_id = self.last_record_id + 1;
        self.last_record_id += 1;

        let new_record = Record {
            id: U64::from(record_id),
            sender: account_id,
            message,
            donated_value: U128::from(deposit),
            created_at: env::block_timestamp(),
        };
        self.records.insert(&record_id, &new_record);

        let storage_require = env::storage_usage() - storage_used;

        let transfer_value = deposit - Balance::from(storage_require) * STORAGE_PRICE_PER_BYTE;
        Promise::new("ukraine.testnet".to_string()).transfer(transfer_value)
    }

    pub fn get_records(&self, from: U64, limit: u64) -> Vec<Record> {
        let start_rev = if self.last_record_id > from.0 {
            self.last_record_id - from.0
        } else {
            1
        };
        let end_rev = if start_rev > limit {
            start_rev - limit
        } else {
            1
        };

        let mut result = Vec::new();
        log!("{} - {}", &start_rev, &end_rev);
        for id in (end_rev..(start_rev + 1)).rev() {
            log!("{}", &id);
            let record = self.records.get(&id).unwrap();
            result.push(record);
        }
        result
    }
}
