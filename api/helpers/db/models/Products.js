/* eslint-disable camelcase */
'use strict'

module.exports = (sequelize, Datatypes) => {
  const model = sequelize.define('products', {
    name: Datatypes.STRING,
    code: Datatypes.STRING,
    media: Datatypes.JSON,
    price: Datatypes.JSON,
    sizes: Datatypes.TEXT,
    externalURL: Datatypes.STRING,
    brand: Datatypes.STRING,
    category: Datatypes.TEXT,
    color: Datatypes.STRING,
    subColor: Datatypes.STRING,
    colorPallet: Datatypes.STRING,
  })

  sequelize.query(
    `CREATE OR REPLACE FUNCTION from_hex(t text) RETURNS integer AS $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN EXECUTE 'SELECT x'''||t||'''::integer AS hex' LOOP
        RETURN r.hex;
      END LOOP;
    END
    $$ LANGUAGE plpgsql IMMUTABLE STRICT;`)
    .catch(e => console.log(e))

  model.getById = function(id) {
    return this.findOne({where: {id}})
  }

  model.createInstance = function(opts) {
    return this.findOne({
      where: Object.assign(
        {code: opts.code.toLowerCase()},
        opts.username.toLowerCase() === 'ali' ?
          {} : {userUsername: opts.username.toLowerCase()})
    })
    .then(cp => cp ?
      cp.update({
        name: opts.name.toLowerCase(),
        price: opts.price,
        media: opts.media,
        sizes: opts.sizes,
        externalURL: opts.externalURL,
        brand: opts.brand,
        category: opts.category,
        color: opts.color,
        subColor: opts.subColor,
        colorPallet: opts.colorPallet,
        shopAddressId: opts.shopAddress.id,
      }) :
      this.create({
        name: opts.name.toLowerCase(),
        code: opts.code.toLowerCase(),
        price: opts.price,
        media: opts.media,
        sizes: opts.sizes,
        externalURL: opts.externalURL,
        brand: opts.brand,
        category: opts.category,
        color: opts.color,
        subColor: opts.subColor,
        colorPallet: opts.colorPallet,
        shopAddressId: opts.shopAddress.id,
        userUsername: opts.username.toLowerCase()
      })
    )
  }

  model.getProducts = function(username, query, offset) {
    return this.findAll(Object.assign({
      where: Object.assign({userUsername: username.toLowerCase()},
        query && query.name ?
          {name: {[Datatypes.Op.like]: `%${query.name}%`}} : {},
        query && query.brand ?
          {brand: {[Datatypes.Op.like]: `%${query.brand}%`}} : {},
        query && query.color ?
          {color: {[Datatypes.Op.like]: `%${query.color}%`}} : {},
        query && query.subColor ?
          {subColor: {[Datatypes.Op.like]: `%${query.subColor}%`}} : {},
        query && query.category ?
          {category: {[Datatypes.Op.like]: `%${query.category}%`}} : {}),
      limit: 20,
      offset: offset,
      include: [{
        model: sequelize.models.Addresses,
        as: 'shopAddress'
      },
      {
        model: sequelize.models.Users,
        as: 'user',
        attributes: sequelize.models.Users.shortAttributes
      }]
    }, query.hex ? {
      order: sequelize.literal(
`((pow(from_hex(SUBSTRING("colorPallet", 1, 2)) - from_hex('${query.hex.slice(1, 3)}'), 2)) + (pow(from_hex(SUBSTRING("colorPallet", 3, 2)) - from_hex('${query.hex.slice(3, 5)}'), 2)) + (pow(from_hex(SUBSTRING("colorPallet", 5, 2)) - from_hex('${query.hex.slice(5, 7)}'), 2)))`)
    } : {}))
  }

  return model
}
