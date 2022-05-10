import { registerAbilitiesTooltip } from "../../../packages/DotaAbilityTooltip";
registerAbilitiesTooltip({
    xmlTooltip: "file://{resources}/layout/custom_game/tooltips/towers_tooltip.xml",
    isShown: abilityIndex => Abilities.GetAbilityName(abilityIndex) !== "witch_doctor_paralyzing_cask",
    onShown: (panel, abilityIndex) => {
        panel.SetDialogVariable("AbilityHeader", Abilities.GetAbilityName(abilityIndex));
        panel.SetDialogVariable("abilityDescription", $.Localize(`#Dota_tooltip_ability_${Abilities.GetAbilityName(abilityIndex)}_description`));
        panel.SetDialogVariable("lore", $.Localize(`#Dota_tooltip_ability_${Abilities.GetAbilityName(abilityIndex)}_lore`));
        panel.SetDialogVariable("name", $.Localize(`#Dota_tooltip_ability_${Abilities.GetAbilityName(abilityIndex)}`));
        panel.FindChildTraverse("AbilityImage").abilityname = Abilities.GetAbilityName(abilityIndex);
    },
});
