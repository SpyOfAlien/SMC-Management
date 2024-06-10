App = {
  web3Provider: null,
  contracts: {},
  emptyAddress: "0x0000000000000000000000000000000000000000",
  sku: 0,
  upc: 0,
  metamaskAccountID: "0x0000000000000000000000000000000000000000",
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 0,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",

  init: async function () {
    App.readForm();
    /// Setup access to blockchain
    await App.initWeb3();
  },

  readForm: function () {
    App.sku = $("#sku").val();
    App.upc = $("#upc").val();
    App.ownerID = $("#ownerID").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();
  },

  initWeb3: async function () {
    /// Find or Inject Web3 Provider
    /// Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", function (accounts) {
          // Time to reload your interface with accounts[0]!
          App.metamaskAccountID = accounts[0];
          console.log("metamaskAccountID", App.metamaskAccountID);
        });

        App.ownerID = accounts[0];
        App.originFarmerID = accounts[0];
        App.metamaskAccountID = accounts[0];

        window.web3 = new Web3(App.web3Provider);

        App.initSupplyChain();
      } catch (error) {
        console.log("error", error);
        // User denied account access...
        console.error("User denied account access");
      }
    }
  },

  initSupplyChain: function () {
    /// Source the truffle compiled smart contracts
    const jsonSupplyChain = "../../build/contracts/SupplyChain.json";

    /// JSONfy the smart contracts
    $.getJSON(jsonSupplyChain, function (data) {
      console.log("data", data);
      const SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      App.fetchEvents();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", App.handleButtonClick);
  },

  handleButtonClick: async function (event) {
    event.preventDefault();

    App.readForm();

    var processId = parseInt($(event.target).data("id"));
    console.log("processId", processId);

    switch (processId) {
      case 1:
        return await App.harvestItem(event);
        break;
      case 2:
        return await App.processItem(event);
        break;
      case 3:
        return await App.packItem(event);
        break;
      case 4:
        return await App.sellItem(event);
        break;
      case 5:
        return await App.buyItem(event);
        break;
      case 6:
        return await App.shipItem(event);
        break;
      case 7:
        return await App.receiveItem(event);
        break;
      case 8:
        return await App.purchaseItem(event);
        break;
      case 9:
        return await App.fetchItemBufferOne();
        break;
      case 10:
        return await App.fetchItemBufferTwo();
      case 11:
        return await App.generateRandomUPC(event);
        break;
    }
  },

  harvestItem: function (event) {
    event.preventDefault();

    const upc = $("#upcCreate").val();

    console.log("upc", upc);

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.harvestItem(
          +upc,
          App.metamaskAccountID,
          App.originFarmName,
          App.originFarmInformation,
          App.originFarmLatitude,
          App.originFarmLongitude,
          App.productNotes,
          {
            from: App.metamaskAccountID,
            gas: 6721975,
            gasPrice: 20000000000,
          }
        );
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        App.fetchItemBufferOne(+upc);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  processItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.processItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("processItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  packItem: function (event) {
    event.preventDefault();

    const upc = +$("#upc").val();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.packItem(upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("packItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  sellItem: function (event) {
    event.preventDefault();
    const upc = +$("#upc").val();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        const productPrice = web3.utils.toWei(1, "ether");
        console.log("productPrice", productPrice);
        return instance.sellItem(upc, productPrice, {
          from: App.metamaskAccountID,
        });
      })
      .then(function (result) {
        console.log("sellItem", result);
        App.fetchItemBufferTwo(upc);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  buyItem: function (event) {
    event.preventDefault();
    const upc = +$("#upc").val();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        const walletValue = web3.utils.toWei(1, "ether");
        return instance.buyItem(upc, {
          from: App.metamaskAccountID,
          value: walletValue,
        });
      })
      .then(function (result) {
        console.log("buyItem", result);
        App.fetchItemBufferTwo(upc);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  shipItem: function (event) {
    event.preventDefault();
    const upc = +$("#upc").val();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.shipItem(upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("shipItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  receiveItem: function (event) {
    event.preventDefault();
    const upc = +$("#upc").val();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.receiveItem(upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("receiveItem", result);
        App.fetchItemBufferTwo(upc);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  purchaseItem: function (event) {
    event.preventDefault();
    const upc = +$("#upc").val();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.purchaseItem(upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("purchaseItem", result);
        App.fetchItemBufferTwo(upc);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchItemBufferOne: function (upc = null) {
    const payload = upc ? upc : +$("#upc").val();

    console.log("fetchItemBufferOne", payload);
    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.fetchItemBufferOne(payload);
      })
      .then(function (result) {
        const { ownerID, itemSKU, itemUPC } = result;
        console.log(ownerID, itemSKU, itemUPC);
        $("#sku").val(itemSKU.words[0]);
        $("#upc").val(itemUPC.words[0]);
        $("#ownerID").val(ownerID);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchItemBufferTwo: function (upc = null) {
    const payload = upc ? upc : +$("#upc").val();

    console.log(upc);

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.fetchItemBufferTwo.call(payload);
      })
      .then(function (result) {
        const {
          distributorID,
          consumerID,
          retailerID,
          productPrice,
          productNotes,
        } = result;
        const fallbackAddress = "0x0000000000000000000000000000000000000000";

        if (distributorID !== fallbackAddress) {
          $("#distributorID").val(distributorID);
        }

        if (consumerID !== fallbackAddress) {
          $("#consumerID").val(consumerID);
        }

        if (retailerID !== fallbackAddress) {
          $("#retailerID").val(retailerID);
        }

        if (productNotes !== "") {
          $("#productNotes").val(productNotes);
        }

        const price = web3.utils.fromWei(productPrice.toString(), "ether");
        if (price !== "0") {
          $("#productPrice").val(price);
        }

        console.log("fetchItemBufferTwo", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchEvents: function () {
    if (
      typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function"
    ) {
      App.contracts.SupplyChain.currentProvider.sendAsync = function () {
        return App.contracts.SupplyChain.currentProvider.send.apply(
          App.contracts.SupplyChain.currentProvider,
          arguments
        );
      };
    }

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        var events = instance.allEvents(function (err, log) {
          if (!err)
            $("#ftc-events").append(
              "<li>" + log.event + " - " + log.transactionHash + "</li>"
            );
        });
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  generateRandomUPC: () => {
    $("#upcCreate").val(Math.floor(Math.random() * 90000) + 10000);
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
