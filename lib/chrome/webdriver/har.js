'use strict';

const log = require('intel').getLogger('browsertime.chrome');
const perflogParser = require('chrome-har');
const harBuilder = require('../../support/har/');
const { Type } = require('selenium-webdriver').logging;

module.exports = async function(
  runner,
  result,
  index,
  cdpClient,
  logPerfEntries,
  includeResponseBodies,
  mobileEmulation,
  androidClient
) {
  log.debug('Getting performance logs from Chrome');

  const logs = await runner.getLogs(Type.PERFORMANCE);
  const messages = logs.map(entry => JSON.parse(entry.message).message);

  if (logPerfEntries) {
    result.extraJson[`chromePerflog-${index}.json`] = messages;
  }

  const har = perflogParser.harFromMessages(messages);

  if (includeResponseBodies === 'html' || includeResponseBodies === 'all') {
    await cdpClient.setResponseBodies(har);
  }

  const versionInfo = (await cdpClient.send(
    'Browser.getVersion'
  )).product.split('/');
  const info = {
    name: versionInfo[0],
    version: versionInfo[1]
  };

  if (mobileEmulation) {
    info.name = `Chrome Emulated ${this.chrome.mobileEmulation.deviceName}`;
  }
  harBuilder.addBrowser(har, info.name, info.version);

  if (androidClient) {
    har.log._android = await androidClient.getModel();
  }

  if (har.log.pages.length > 0) {
    har.log.pages[0].title = `${result.url} run ${index}`;
    // Hack to add the URL from a SPA
    if (result.alias && !this.aliasAndUrl[result.alias]) {
      this.aliasAndUrl[result.alias] = result.url;
      har.log.pages[0]._url = result.url;
    } else if (result.alias && this.aliasAndUrl[result.alias]) {
      har.log.pages[0]._url = this.aliasAndUrl[result.alias];
    } else {
      har.log.pages[0]._url = result.url;
    }
  }
  return har;
};