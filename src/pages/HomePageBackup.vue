<template>
  <q-layout view="lhh LpR fFf" @scroll="onScroll">
    <q-header class="home-toolbar transparent">
      <q-toolbar class="q-py-md" style="background: transparent">
        <q-toolbar-title class="small-caps"> Aniims&trade; </q-toolbar-title>
        <div v-if="$q.screen.gt.xs">
          <q-btn
            flat
            no-caps
            color=""
            label="About"
            size="14pt"
            class="small-caps"
            @click="goToAbout"
          />
          <q-btn
            flat
            no-caps
            color=""
            label="Contact"
            size="16pt"
            class="small-caps"
            @click="goToForm"
          />
        </div>
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'brightness_3' : 'sunny'"
          class="q-mr-xs rotate-90"
          @click="$q.dark.toggle"
        />
        <q-btn flat dense icon="more_vert">
          <q-menu>
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup @click="goToAbout">
                <q-item-section side>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>About us</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="goToForm">
                <q-item-section side>
                  <q-icon name="phone" />
                </q-item-section>
                <q-item-section>Contact us</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/app">
                <q-item-section side>
                  <q-icon name="apps" />
                </q-item-section>
                <q-item-section>Go to App</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <!--<q-scroll-observer @scroll="onScroll" />-->
      <q-page
        style="margin-top: -90px; background-attachment: fixed"
        class="modern-bg"
      >
        <q-parallax
          :src="
            $q.dark.isActive
              ? '../assets/designbg.jpg'
              : '../assets/modernbg.jpg'
          "
          style="height: 100vh"
        >
          <div
            class="backdrop fit justify-center q-pt-xl"
            align="center"
            style="margin-top: 1px"
          >
            <q-separator spaced inset vertical dark />
            <AnimateOnScroll>
              <AnimateOnScroll>
                <div
                  class="text-white text-h1 text-center q-mt-xl q-pt-xl small-caps"
                >
                  Aniims
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll>
                <div
                  class="text-white q-pa-sm q-px-lg q-py-xl text-h4"
                  style="
                    font-variant: small-caps;
                    opacity: 1;
                    border-radius: 4px;
                    font-weight: 300;
                    width: auto;
                  "
                  align="center"
                >
                  Advanced Nafdac Investigation Information Management System
                </div>
              </AnimateOnScroll>
              <div
                class="hero-banner text-white q-pa-md q-my-xl text-h5"
                style="opacity: 1; font-size: 16px"
                align="center"
              >
                <q-btn
                  unelevated=""
                  rounded
                  padding="sm"
                  color="cyan-9"
                  size="md"
                  label="Go to workspace"
                  icon=""
                  icon-right="arrow_forward"
                  style="font-size: 18px"
                  to="/app"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </q-parallax>

        <div name="about" id="about"></div>

        <div
          class="text-h4 text-center q-py-xl"
          :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'"
          :style="myTweak($q.screen)"
          style="opacity: 0.9"
        >
          <div
            class="q-my-md q-mx-xl q-pb-md text-teal"
            style="border-bottom: 1px solid"
          >
            About <strong class="small-caps">Aniims</strong>
          </div>
          <AnimateOnScroll>
            <q-card
              flat
              class="text-h5 text-justify q-mb-xl bg-transparent text-black"
              :class="$q.dark.isActive ? 'text-grey-3' : ''"
              style="font-weight: 300; height: auto; border-radius: 16px"
            >
              <q-card-section style="font-weight: 300">
                The Aniims platform streamlines the processes, procedures and
                operations of NAFDAC Investigation and Enforcement Directorate
                with focus on automation, accuracy, efficiency, reliability,
                data security, processing and storage.
              </q-card-section>
              <q-card-section style="font-weight: 300">
                National Agency for Food and Drug Administration and Control.
                NAFDAC is WHO ML 3 Certified. Headquarters is located at Plot
                234 Olusegun Obasanjo Way, Gerki, Abuja, Nigeria NG, West
                Africa.
                <q-separator spaced inset vertical dark />
                <div class="text-body1">Email: nafdac@nafdac.gov.ng</div>
              </q-card-section>
            </q-card>
          </AnimateOnScroll>
        </div>

        <q-card
          flat
          class="my-card fit"
          style="opacity: 0.9"
          :style="myTweak($q.screen)"
          :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'"
        >
          <q-card-section align="center" :style="myTweak($q.screen)">
            <div
              class="text-h4 text-center q-py-md text-teal"
              style="opacity: 1; border-bottom: 1px solid"
            >
              Why are you here?
            </div>
          </q-card-section>
          <q-card-section align="center" class="full-width">
            <div class="row q-col-gutter-xs">
              <div
                v-for="(item, i) of callToACtions"
                :key="i"
                class="col col-xs-12 col-sm-6 col-md-4 col-lg-3"
              >
                <AnimateOnScroll>
                  <q-card
                    flat
                    dark
                    class="full-width full-height"
                    :class="$q.dark.isActive ? 'bg-cyan-10' : 'bg-cyan-9'"
                    style="min-height: 280px; vertical-align: middle"
                  >
                    <q-card-section>
                      <q-item
                        clickable=""
                        stretch=""
                        class="full-height"
                        :to="item.link"
                        @click="item.action"
                      >
                        <q-item-section>
                          <div>
                            <q-avatar
                              color=""
                              text-color="white"
                              :icon="item.icon"
                              size="98px"
                            />
                          </div>

                          <div class="q-py-xl text-h4 small-caps">
                            <label style="font-weight: 300">{{
                              item.name
                            }}</label>
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                  </q-card>
                </AnimateOnScroll>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div name="form" id="form"></div>
        <div
          square
          flat
          :style="
            $q.dark.isActive
              ? 'background:linear-gradient(45deg, black, indigo)'
              : 'background:linear-gradient(-45deg, white, white)'
          "
          style="opacity: 0.9"
          :class="$q.dark.isActive ? 'text-grey-2' : 'text-grey-10'"
          align="center"
        >
          <div class="q-pb-md" :style="myTweak($q.screen)">
            <div
              class="text-h4 text-center q-py-lg q-mb-lg text-teal"
              style="border-bottom: 1px solid; border-radius: 0px"
            >
              Contact us
            </div>

            <div class="row q-col-gutter-md flex flex-center">
              <div class="col col-xs-12 col-sm-6 col-md-5 col-lg-5">
                <q-card flat square class="my-card-3 bg-transparent text-h6">
                  <q-card-section align="center">
                    <div class="text-h4">Have questions or complaints?</div>
                    <q-separator spaced inset vertical dark />
                    <div class="text-h5">
                      Send us a message or visit our office
                    </div>
                  </q-card-section>
                  <q-card-section align="center" class="text-">
                    Address:
                    <address>10-15 Mobil Road, Apapa, Lagos State</address>
                    <q-separator spaced inset vertical dark />
                    Phone:
                    <address>+234 805 116 9979</address>
                    <q-separator spaced inset vertical dark />
                    Email:
                    <address>enforcement@nafdac.gov.ng</address>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col col-xs-12 col-sm-6 col-md-5 col-lg-5">
                <q-card
                  class="my-card"
                  :class="
                    $q.dark.isActive
                      ? 'bg-grey-10 shadow-0'
                      : 'shadow-22 bg-grey-1-'
                  "
                  :style="
                    $q.dark.isActive
                      ? 'border:1px solid red'
                      : 'border:2px solid red'
                  "
                  style="opacity: 0.8"
                >
                  <q-card-section
                    class="text-white"
                    :class="$q.dark.isActive ? 'bg-pink-10' : 'bg-pink'"
                  >
                    <div class="text-h6 small-caps">Drop a message</div>
                  </q-card-section>
                  <q-card-section>
                    <AnimateOnScroll>
                      <ContactForm
                        :buttonColor="$q.dark.isActive ? 'grey-2' : green"
                      />
                    </AnimateOnScroll>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>

        <div
          class="row bg-blue-grey-"
          style="background: linear-gradient(90deg, #007, #007, #007)"
        >
          <div
            class="col col-xs-12 col-sm-6 col-md-3 col-lg-3"
            v-for="(widget, i) of widgets"
            :key="i"
          >
            <AnimateOnScroll>
              <FooterMenuCard
                :title="widget.title"
                :icon="widget.icon"
                :items="widget.items"
                class="text-grey-3"
              />
            </AnimateOnScroll>
          </div>
        </div>
      </q-page>
      <!-- Wrapping only one DOM element-->

      <q-page-sticky
        v-if="scrollInfo?.position > 62"
        position="top"
        :offset="[0, 0]"
        expand
      >
        <q-toolbar
          class="text-white"
          style="background: linear-gradient(45deg, teal, indigo)"
        >
          <q-toolbar-title class="small-caps"> Aniims&trade; </q-toolbar-title>
          <div v-if="$q.screen.gt.xs">
            <q-btn
              flat
              no-caps
              color=""
              label="About"
              size="14pt"
              class="small-caps"
              @click="goToAbout"
            />
            <q-btn
              flat
              no-caps
              color=""
              label="Contact"
              size="16pt"
              class="small-caps"
              @click="goToForm"
            />
          </div>
          <q-btn
            flat
            round
            dense
            :icon="$q.dark.isActive ? 'brightness_3' : 'sunny'"
            class="q-mr-xs rotate-90"
            @click="$q.dark.toggle"
          />
          <q-btn flat dense icon="more_vert">
            <q-menu>
              <q-list style="min-width: 180px">
                <q-item clickable v-close-popup @click="goToAbout">
                  <q-item-section side>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>About us</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="goToForm">
                  <q-item-section side>
                    <q-icon name="phone" />
                  </q-item-section>
                  <q-item-section>Contact us</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup to="/app">
                  <q-item-section side>
                    <q-icon name="apps" />
                  </q-item-section>
                  <q-item-section>Go to App</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-page-sticky>
    </q-page-container>

    <q-page-scroller
      position="bottom-left"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab-mini icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>

    <div
      class="q-pa-md q-py-xl text-grey-1 footer"
      style="background: linear-gradient(90deg, #003, #003, #003)"
    >
      Copyright &copy; {{ new Date().getFullYear() }}
      <span style="font-variant: small-caps"
        >Nafdac Investigation and Enforcement Directorate</span
      >
    </div>
  </q-layout>
</template>

<script setup>
//import { Title } from "chart.js";
//import("https://unpkg.com/aos@2.3.1/dist/aos.js");
import { ref } from "vue";
import AnimateOnScroll from "src/components/AnimateOnScroll.vue";
import FooterMenuCard from "src/components/FooterMenuCard.vue";
import ContactForm from "src/components/forms/ContactForm.vue";
var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();
// (function () {
var s1 = document.createElement("script"),
  s0 = document.getElementsByTagName("script")[0];
s1.async = true;
s1.src = "https://embed.tawk.to/65241c586fcfe87d54b811e9/1hcagtgks";
//s1.charset = "UTF-8";
s1.setAttribute("crossorigin", "*");
s0.parentNode.insertBefore(s1, s0);
// })();
const scrollInfo = ref({});
const callToACtions = [
  {
    name: "Complaint",
    icon: "campaign",
    action: null,
    link: "/petition",
  },
  {
    name: "Destruction",
    icon: "delete",
    action: null,
    link: "/destruction",
  },
  {
    name: "Contact",
    icon: "mail",
    action: goToForm,
    link: null,
  },
];
const widgets = [
  {
    title: "Address",
    icon: "map",
    items: [
      {
        label: "Head office",
        value: "10-15 Mobil Road, Apapa, Lagos, Nigeria",
      },
      {
        label: "Zonal offices",
        value: "Asaba, Abuja, Kaduna",
      },
    ],
  },
  {
    title: "Phone",
    icon: "phone",
    items: [
      {
        label: "Lagos",
        value: "+234 805 116 9979",
      },
      {
        label: "Aniims",
        value: "+234 808 704 5508",
      },
    ],
  },
  {
    title: "Email",
    icon: "mail",
    items: [
      {
        label: "Director",
        value: "enforcement@nafdac.gov.ng",
      },
      {
        label: "Aniims",
        value: "admin@aniims.net",
      },
    ],
  },
  {
    title: "Links",
    icon: "link",
    items: [
      {
        label: "Nafdac",
        value: "nafdac.gov.ng",
      },
      {
        label: "Import",
        value: "trade.gov.ng",
      },
    ],
  },
];

function myTweak(screen) {
  let style = screen.gt.sm
    ? "padding-left:80px; padding-right:80px;"
    : screen.gt.xs
    ? "paddingleft:40px; padding-right:40px;"
    : "padding-left:16px; padding-right:16px;";
  //style += "padding-top:2px;padding-bottom:2px";
  return style;
}
function onClick(e, data) {}

function goToForm() {
  document.getElementById("form").scrollIntoView(true, {
    behavior: "smooth",
  });
}
function goToAbout() {
  document.getElementById("about").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
const onScroll = (info) => {
  scrollInfo.value = info;
  //console.log(info);
};
//onMounted(() => chatWidget());
// tawk.to api_key: fd56e7333fe5493fd493a60e2d2cda65a55ece4a
</script>

<style lang="scss" scoped>
/*@import url("https://unpkg.com/aos@2.3.1/dist/aos.css");*/
.hero-bg {
  min-height: 300px;
  /*background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: url("/assets/mountains.jpg");*/
}
.footer {
  font-size: 13px;
  background: linear-gradient(#009, #009);
  padding: 16px;
  vertical-align: middle;
}
.header-banner {
  border-radius: 45px;
}
.hero-banner {
  border-radius: 5px;
}
.home-toolbar {
  font-family: Raleway !important;
  font-size: 24px;
  font-weight: 300;
}
.small-caps {
  font-variant: small-caps;
}
.backdrop {
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(000, 000, 000, 0.6),
    rgba(000, 000, 000, 0.8)
  );
}
.text-h4 {
  font-size: 42px;
  font-weight: 300;
}
@media only screen and (max-width: 900px) {
  .my-card-2 .my-card-child {
    margin-top: 0px;
  }
}
</style>
