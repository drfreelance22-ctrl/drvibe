import { Pressable } from "react-native";
import { remapProps } from "nativewind";

/**
 * Globally disable NativeWind's className handling on Pressable.
 * This prevents the common pitfall where Pressable + className
 * causes onPress not to fire.
 */
remapProps(Pressable, { className: false });
