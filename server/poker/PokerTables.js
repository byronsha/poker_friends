const Deck = require('./Deck');

module.exports = class PokerTables {
  constructor() {
    this.tables = {}
  }

  sitPlayer(userId, tableId, seat, stackAmount) {
    if (this.tables[tableId]) {
      if (this.tables[tableId].find(p => p.userId === userId || p.seat === seat)) {
        console.log(`WARNING: Can't sit at seat twice!`)
        return
      }
      this.tables[tableId].push({ userId, seat, stackAmount });
    } else {
      this.tables[tableId] = [{ userId, seat, stackAmount }]
    }
  }

  standPlayer(userId, tableId) {
    if (this.tables[tableId]) {
      const newPlayers = this.tables[tableId].filter(p => p.userId !== userId)
      this.tables[tableId] = newPlayers;
    }
  }

  players(tableId) {
    return this.tables[tableId] || [];
  }

  newDeck() {
    return new Deck();
  }
}



/* 
--Table--
id
entity_id
group_id
name
creator_id
small_blind_amount
big_blind_amount
max_players

--Hand--
id
entity_id
table_id
big_blind_amount
button_id
small_blind_id
big_blind_id
is_completed
went_to_showdown
pots
winners
end_of_session: boolean
seat_one_id...seat_nine_id
json blob?: 
  seat_one_hand...seat_nine_hand
  seat_one_stack_start..seat_nine_stack_start
  seat_one_stack_end..seat_nine_stack_end

--Action--
id
entity_id
hand_id
user_id
seat
position (btn = 1, sb = 2, ...)
next_user_id
next_user_stack
street (deal|preflop|flop|turn|river)
action (raise|allin|call|check|fold)
amount
remaining_stack
main_pot
side_pots
next_turn_min_raise

-- [first action] --
id
hand_id
player_id: null
seat: null
position: null
next_player_id:
street (deal)
action: null
amount: 0
current_bet_amount: 0
main_pot
side_pots


--Player--
id
group_id
user_id
bankroll

--Group--
id
name
creator_id

--Group Admin--
id
group_id
user_id



1. Click seat
2. SitAtTableMutation
3. Store table_id/user_id/seat (Game server stored in memory, passed thru context)
4. StandFromTableMutation (...)
5. In 'Sit' mutation, check context game for atleast 2 players sitting at table, create a hand
6. Create Table.currentHand graphql resolver
  - isViewerTurn
  - players (updated at start of each hand, read from this to rotate turns)
  - isFolded (needed?)
  - holeCards
  - actions (array)
  - street
  - pot
  - sidePots
  - options (call, raise, fold)
  - minRaise
  - smallBlindPlayer
  - bigBlindPlayer
  - buttonPlayer (needed?)

7. Create Pubsub event.
8. Frontend subscribes to currentHand

handUpdated (tableEntityId)
*/