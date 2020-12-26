
#define RULE_ARG(C,X,Y) mapgen_panel_container* C, int X, int Y
#define RULE_ARG_P RULE_ARG(cont, x, y);
#define RULES_NUM 2


void rule_192_137_93(RULE_ARG_P); // 台
void rule_192_179_93(RULE_ARG_P); // 土壌
void rule_otherwise (RULE_ARG_P); // 上記以外


mapgen_rule rules[RULES_NUM] = {
    {192, 137, 93, rule_192_137_93},
    {192, 179, 93, rule_192_179_93}
};

void rule_192_137_93(RULE_ARG(cont, x, y)){
    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x05, 0x06, 0x07,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,PANEL_VOID
        );
}

void rule_192_179_93(RULE_ARG(cont, x, y)){

    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x00, 0x01, 0x02,
        0x10, 0x11, 0x12,
        0x20, 0x21, 0x22,
        0x03, 0x04,
        0x13, 0x14
        );
    
    //panel_container_insert(cont, x, y, 0x11, 0x00, 0);
        
}

void rule_otherwise(RULE_ARG(cont, x, y)){
    panel_container_insert(cont, x, y, PANEL_VOID, 0x00, 0);
}

