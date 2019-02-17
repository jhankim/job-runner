const getProducts = require('./utilities/getProductsFromFormat');
const transform = require('./utilities/transformers');
const conn = require('./utilities/connections');

const sendItems = (res) => (items) => {
  res.json({ data: { detected_fields: items } });
};

const sendError = (res) => (error) => {
  res.json({ data: { error: error.toString() } });
};

const fields = (req, res) => {
  const location = req.body.location;
  const path = req.body.location_path;
  const format = req.body.format;
  const xpath = req.body.xpath || '';

  const getExtractedProducts = getProducts.fromFormat(format, xpath);

  // conn.getStreamFromLocation(location, path)
  //   .then(getExtractedProducts)
  //   .then(sendItems(res))
  //   .catch(sendError(res));
};

const sample = (req, res) => {
  res.json({ data: { xml: transform.mapSampleNode(req.body) } });
};

module.exports = {
  fields,
  sample,
};