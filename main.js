import logger from './src/classes/LoggerService.js'
import WingReport from './src/presentation/WingReport.js'
logger.info('Wing Snap Report Generator started')
const report = new WingReport('./storage/wing-snaps/Console.json')
