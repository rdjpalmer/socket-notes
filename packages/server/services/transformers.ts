import showdown from "showdown";
import { MessageTransformer } from "../../../types/Message";

const converter = new showdown.Converter();

export const markdownTransformer: MessageTransformer = (data) => converter.makeHtml(data);