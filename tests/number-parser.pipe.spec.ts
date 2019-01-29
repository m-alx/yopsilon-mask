// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NumberParserPipe } from "../src/numbers/number-parser.pipe";
import { InternationalizationService } from "../src/internationalization/internationalization.service";

// this.parseFormat("{.3-5} РУБ");
let testStr = "$123,456,789.01";
let testFmt = "${1.2}";
