const Hand = `
  type Stacks {
    seat1Stack: Int
    seat2Stack: Int
    seat3Stack: Int
    seat4Stack: Int
    seat5Stack: Int
    seat6Stack: Int
    seat7Stack: Int
    seat8Stack: Int
    seat9Stack: Int
  }

  type Bets {
    seat1Bet: Int
    seat2Bet: Int
    seat3Bet: Int
    seat4Bet: Int
    seat5Bet: Int
    seat6Bet: Int
    seat7Bet: Int
    seat8Bet: Int
    seat9Bet: Int
  }

  type Statuses {
    seat1Status: String
    seat2Status: String
    seat3Status: String
    seat4Status: String
    seat5Status: String
    seat6Status: String
    seat7Status: String
    seat8Status: String
    seat9Status: String
  }

  type Hand { 
    stacks: Stacks!
    bets: Bets!
    statuses: Statuses!
  }
`

module.exports = Hand;