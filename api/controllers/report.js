/* eslint-disable camelcase */
'use strict'

const prettyHtml = require('json-pretty-html').default

module.exports = function(dependencies) {
  const {notifications} = dependencies

  return {
    processIssueReport: function(req, res, next) {
      const username = req.headers['x-consumer-username']
      const body = req.swagger.params.body.value
      let bodyToSend = ''

      if (body && body.type && body.type === 'CreateOutfit') {
        bodyToSend = `
Users chosen color:
<div style="margin-left: auto;margin-right: auto;width:150px;height:150px;border-radius: 10px;border:2px solid #000;background-color: ${body.hex};padding: 5px;">
</div>
<div style="text-align: center; padding: 5px;">
  ${body.hex}
</div>
Recognized as <strong> ${body.subColor} </strong>. Change it to: <br>
<div style="width: 100%;float: left;">
${['WHITE', 'PURPLE', 'BLUE', 'RED', 'GRAY', 'ORANGE', 'BLACK', 'GREEN', 'YELLOW'].map(c => `
  <a style="text-shadow: 0px 0px 5px black, 0px 0px 8px black;box-shadow: 0px 0px 5px black;margin: 10px; background-color: ${c.toLowerCase()};color: white;padding: 10px; text-align: center;text-decoration: none;display: inline-block;font-size: 16px;border-radius: 10;" href="__SWB__/add_color_code?code=${body.hex}&name=${c}">${c}</a>`).join('\n')}
<div/>
<p style="float: none;">User product collection:</p>
${body.products.map(p => `<table style="width: 100%;">
  <tr>
    <td style="width:160px;">
      <img src="${p.media[0].standard_resolution.url}" style="width:150px;border-radius: 10px; margin-top: 10px;">
      </img>
    </td>
    <td style="padding: 20px;">
      <span style="float: none;">
        ID: ${p.id}<br>
        Code: ${p.code}<br>
        Name: ${p.name}<br>
        <div style="width: 100%; float: left; margin-top: 20px;">
          ${p.colorPallet.match(/.{1,6}/g).map((t, i) => `
            <a href="__SWB__/change_product_color?id=${p.id}&color_pallet=${t + p.colorPallet.replace(t, '')}" style="margin-left: auto;margin-right: auto;width:50px;height:50px;border-radius: 10px;border:4px solid ${i === 0 ? 'darkgreen' : '#000'};background-color: #${t};padding: 5px;display: inline-block;margin-right: 5px;">`).join('\n')}
          </a>
        </div>
      </span>
    </td>
  </tr>
</table>`).join('\n')}
        `
      }

      if (!bodyToSend) {
        bodyToSend = `
        Unprocessed content: <br/>
        ${prettyHtml(body)}
        `
      }

      notifications.emailAdmin({
        subject: `${username.replace('m_g_i_o_s_', '')} reported an issue`,
        body: bodyToSend
      })
      .then(r => {
        res.json({success: true})
        next()
      })
      .catch(e => next(e))
    }
  }
}
