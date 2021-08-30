import { Config } from "types";
import ConfigJson from "../config/index";
import FTP from "ftp";
import { Logger } from "common";
import { Validator } from "common";
import shelljs from "shelljs";

const bootstrap = async (config: Config) => {
  try {
    Logger.info("INICIANDO CLIENTE DE INTEGRAÇÃO SEEDZ.");
    validate(config);

    Logger.info("VALIDANDO CONEXÃO FTP");
    const ftp = new FTP(config.auth.ftp);
    await ftp.connect();
    Logger.info("ENCERRANDO CONEXÃO FTP");
    await ftp.disconnect();

    Logger.info("EXECUTANDO SHELL SCRIPT");
    //const shell = shelljs.exec('ping -c 4 8.8.8.8').code
    const shell = shelljs.exec("./files/EXAMPLE.sh").code;
    if (shell !== 0) {
      Logger.error("ERRO AO EXECUTAR ARQUIVO SH");
      process.exit(1);
    }

    Logger.info("ENVIANDO DADOS XXX VIA FTP");
    const ftp3 = new FTP(config.auth.ftp);
    await ftp3.connect();
    const estoque = ConfigJson.ftp.path + "EXAMPLE.csv";
    const sendFile = await ftp3.sendFile("./files/EXAMPLE.csv", estoque);

    Logger.info("ENCERRANDO PROCESSO");
    process.exit(1);
  } catch (e: any) {
    Logger.error(e.message);
    console.log(e);
  }
};

export default bootstrap;

const validate = (config: Config) => {
  Logger.info("VERIFICANDO CONFIGURAÇÕES.");
  const validator = new Validator(config);
  validator.auth();
  validator.database();
};

bootstrap(ConfigJson);
