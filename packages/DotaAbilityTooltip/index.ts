const dotaHud = (() => {
    let panel: Panel | null = $.GetContextPanel();
    while (panel) {
        if (panel.id === "DotaHud") return panel;
        panel = panel.GetParent();
    }
    return panel;
})();

const FindDotaHudElement = (id: string) => dotaHud?.FindChildTraverse(id);

function AbilitiesTooltipInject(config: TooltipConfig & { shownPanel: Panel }) {
    const { shownPanel, xmlTooltip, isShown = () => true, onShown } = config;
    var tooltipManager = FindDotaHudElement("Tooltips");
    var abilityTooltip = tooltipManager?.FindChildTraverse("DOTAAbilityTooltip");
    if (!abilityTooltip) {
        $.Schedule(0, () => {
            AbilitiesTooltipInject(config);
        });
        return;
    }
    var TooltipContents = abilityTooltip.FindChildTraverse("Contents") as Panel;
    const details = TooltipContents.FindChildTraverse("AbilityDetails") as Panel;
    let customTooltip =
        TooltipContents.FindChildTraverse("CustomTooltip") ?? $.CreatePanel("Panel", TooltipContents, "CustomTooltip");
    customTooltip.BLoadLayout(xmlTooltip, false, false);

    var abilityIndex = ((shownPanel.FindChildTraverse("AbilityImage") as AbilityImage) || shownPanel)
        .contextEntityIndex;
    if (!abilityIndex) return;
    const IsShownCustomTooltip = isShown(abilityIndex);

    TooltipContents.SetHasClass("AbilityContents", !IsShownCustomTooltip);
    TooltipContents.SetHasClass("AbilityContentsInject", IsShownCustomTooltip);
    customTooltip.visible = IsShownCustomTooltip;
    details.visible = !IsShownCustomTooltip;

    onShown?.(customTooltip, abilityIndex);
}

interface TooltipConfig {
    isShown?: (abilityIndex: AbilityEntityIndex) => boolean;
    xmlTooltip: string;
    onShown?: (parentPanel: Panel, abilityEntityIndex: AbilityEntityIndex) => void;
}

export const registerAbilitiesTooltip = (config: TooltipConfig) => {

    let scheduler: ScheduleID | undefined

    const handler = (shownPanel: Panel) => {
        scheduler = undefined;
        AbilitiesTooltipInject({
            ...config,
            shownPanel,
        });
    }

    $.RegisterForUnhandledEvent("DOTAShowAbilityTooltip", handler);
    $.RegisterForUnhandledEvent("DOTAShowAbilityTooltipForEntityIndex", handler);
    $.RegisterForUnhandledEvent("DOTAShowAbilityTooltipForLevel", handler);
    $.RegisterForUnhandledEvent("DOTAShowAbilityTooltipForGuide", handler);
    $.RegisterForUnhandledEvent("DOTAShowAbilityTooltipForHero", handler);

    $.RegisterForUnhandledEvent("DOTAHideAbilityTooltip", () => {
        scheduler = $.Schedule(0.2,() => {
            if (!scheduler) return;
            var TooltipContents = FindDotaHudElement("Tooltips")?.FindChildTraverse("DOTAAbilityTooltip")?.FindChildTraverse("Contents");
            if (!TooltipContents) return;
            const details = TooltipContents.FindChildTraverse("AbilityDetails");
            let customTooltip = TooltipContents.FindChildTraverse("CustomTooltip");
    
            if (customTooltip) {
                customTooltip.visible = false;
            }
            TooltipContents.SetHasClass("AbilityContents", true);
            TooltipContents.SetHasClass("AbilityContentsInject", false);
            if (details) {
                details.visible = true;
            }
        })
    });
};
