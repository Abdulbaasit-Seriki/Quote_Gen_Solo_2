const path = require("path");

exports.getLogo = async (req, res) => {
  const { logo  } = req.params;
  res.sendFile(path.join(__dirname, "../../logos/"+logo));
};


exports.getPrices = async (req, res) => {
    const { prices  } = req.params;
    res.sendFile(path.join(__dirname, "../../prices/"+prices));
  };
  