const scriptService = require('../services/ScriptService');
const ScriptDTO = require('../dtos/ScriptDTO');

exports.getAllScripts = async (req, res) => {
    try {
        const scripts = await scriptService.getScripts(req.query);
        const formattedScripts = scripts.map(s => ScriptDTO.toSummary(s));
        res.status(200).json({ status: 'success', results: formattedScripts.length, data: { scripts: formattedScripts } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getScript = async (req, res) => {
    try {
        const script = await scriptService.getScriptDetails(req.params.id);
        res.status(200).json({ status: 'success', data: { script: script ? new ScriptDTO(script) : null } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.favoriteScript = async (req, res) => {
    try {
        const script = await scriptService.favoriteScript(req.params.id);
        res.status(200).json({ status: 'success', data: { script: new ScriptDTO(script) } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getReaderData = async (req, res) => {
    try {
        const data = await scriptService.getReaderData(req.params.id);
        // Reader data is already filtered by service but can be wrapped in DTO if needed
        res.status(200).json({ status: 'success', data });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
