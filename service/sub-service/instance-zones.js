/**
 * 副本
 * Choose the second hard difficulty, if only one, use the fisrt.
 * Choose the first skill.
 */
const config = require('../../config');
const util = require('../../util');

const instanceZones = async (html, req) => {
  req.logger.info(`account: ${req.account}, function instanceZones start`);
  let DOM = util.convertHtml(html, true);
  let text = DOM.text();
  let label, url;
  while (config.constant.FLAG_LOOP) {
    if (text.includes(config.constant.BREAK_TEXT_INSTANCE_ZONE_LEVEL)) {
      break;
    }
    if (text.includes(config.constant.BREAK_TEXT_INSTANCE_ZONE_COUNT) && !util.getLinksByName(config.constant.ARRAY_INSTANCE_ZONE[2], html)) {
      break;
    }
    if (text.includes(config.constant.TEXT_INSTANCE_ZONE_DIFFICULTY)) {
      let personType = DOM('option').length == 1 ? 1 : DOM('option').get(-2).attribs.value;
      let form = DOM('form')[0];
      let data = `person_type=${personType}`;
      url = form.attribs.action;
      html = await util.post(data, url, req);
      DOM = util.convertHtml(html, true);
      text = DOM.text();
      continue;
    }
    [label, url] = util.getLabelAndURL(config.constant.ARRAY_INSTANCE_ZONE, html);
    if (label == config.constant.ARRAY_INSTANCE_ZONE[4]) {
      html = await util.click(label, url, req);
      DOM = util.convertHtml(html, true);
      text = DOM.text();
      continue;
    }
    if (!url) {
      [label, url] = util.getFirstLink(html);
    }
    html = await util.click(label, url, req);
    DOM = util.convertHtml(html, true);
    text = DOM.text();
  }
  req.logger.info(`account: ${req.account}, function instanceZones end`);
  return await util.backToMainPage(req);
}

module.exports = {
  instanceZones
}