const util = require("./util");
const commandLine = require("./command-line");

const runStr = (source_code, lang = "cpp", options) => {
  const tmp_dir = util.makeTmpDir();
  //copy code to tmp folder tmps filest
  const lang_ext = util.getLangExtension(lang);
  if (lang_ext !== ".cpp") throw new Error(`${lang} is not supported`);
  const tmp_file_path = util.makeTmpFileWithGivenData(
    tmp_dir,
    lang_ext,
    source_code
  );
  options = util.makeOptions(options, tmp_file_path);
  const file_name = util.pathBaseName(tmp_file_path);
  const cc_o_out_file_name = util.pathBaseName(tmp_file_path, ".cpp") + ".out";
  const cc_args = [file_name, "-o", cc_o_out_file_name];
  const cc_status = commandLine.execute("g++", cc_args, options);
  if (cc_status.error) return cc_status;
  const cr_status = commandLine.execute(
    `./${cc_o_out_file_name}`,
    null,
    options
  );
  return cr_status;
};

const runFile = (source_file, lang = "cpp", options) => {
  const lang_ext = util.getLangExtension(lang);
  if (lang_ext !== ".cpp" || util.pathExtName(source_file) != ".cpp")
    throw new Error(`${lang} is not supported`);
  options = util.makeOptions(options, source_file);
  const file_name = util.pathBaseName(source_file);
  const cc_o_out_file_name = util.pathBaseName(source_file, ".cpp") + ".out";
  const cc_args = [file_name, "-o", cc_o_out_file_name];
  const cc_status = commandLine.execute("g++", cc_args, options);
  if (cc_status.error) return cc_status;
  const cr_status = commandLine.execute(
    `./${cc_o_out_file_name}`,
    null,
    options
  );
  return cr_status;
};

module.exports = { runStr, runFile };
