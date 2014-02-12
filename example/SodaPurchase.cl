conversation SodaPurchase {
/*
   * {
   *    guy ={Machine}<Soda.machine
   * }
   */
  agent purchaser concerning Machine {
    indicates spendMoney: Payment
    indicates selection: Selection
    indicates getMoneyBack
    indicates isUnHappy
    indicates isHappy

    begins hasMoney {
      hasMoney {
        spendMoney -> usingMachine > machine.insertCoin
      }
      hasNoMoney {
      }
      collectItem {
        isUnHappy -> hasMoney
        isHappy -> hasNoMoney
      }
      waitingForItem {
        machine.itemEmpty -> makeSelection
        machine.itemDispensed -> collectItem
        machine.moneyReleased -> hasMoney
      }
      makeSelection {
        selection -> waitingForItem > machine.selection
        getMoneyBack -> waitingForItem > machine.releaseMoney
      }
      usingMachine {
        machine.awaitingSelection -> makeSelection
      }
    }
  }

  /*
   * {
   *  machine{Machine} ={Machine}<Guy.guy{Machine}
   * }
   */
  infinite agent machine concerning Machine {
    consumes insertCoin: Payment
    produces awaitingSelection
    consumes selection: Selection
    indicates selectionAvailable
    indicates selectionEmpty
    produces itemDispensed
    produces itemEmpty: Selection
    consumes releaseMoney
    produces moneyReleased

    begins waiting {
      processSelection IMPL {
        selectionAvailable -> waiting > itemDispensed
        selectionEmpty -> pendingSelection > itemEmpty
        releaseMoney -> waiting > moneyReleased
      }
      pendingSelection {
      /*
         * We will have to do something with the money
         */
        IMPL releaseMoney -> waiting > moneyReleased
        selection -> processSelection
      }
      waiting {
        insertCoin -> pendingSelection > awaitingSelection
      }
    }
  }
  /*
   * A type that is used for Paying
   */
  type Payment from inventory.Payment {
  /* type of money */
    String currency?
    amount
    machine
    purchaser
  }
  type Selection from inventory.Selection {
  }
  type Machine from inventory.Machine {
  }
  type Page from inventory.Page {
    id
    address {}
  }
  view /page.html over /page
  resource /page for SodaPurchase.Page offers ( create read update delete ) interchanges ( json )

  view /payment.html over /payment
  resource /payment for SodaPurchase.Payment offers ( create read update delete ) interchanges ( json )
}