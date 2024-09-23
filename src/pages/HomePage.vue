<template>
  <q-layout view="hhh lPr fff" @scroll="onScroll">
    <q-header class="home-toolbar transparent">
      <transition
        appear
        enter-active-class="animated slideInDown duration:1s"
        leave-active-class="animated fadeOut"
      >
        <!-- Wrapping only one DOM element, defined by QBtn -->

        <q-toolbar
          class="q-py-sm text-white"
          style="background: rgba(0, 0, 255, 0)"
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
      </transition>
    </q-header>
    <q-page-container>
      <!--<q-scroll-observer @scroll="onScroll" />-->
      <q-page style="margin-top: -90px">
        <q-parallax
          :src="
            $q.dark.isActive
              ? '../assets/designbg.jpg'
              : '../assets/modernbg.jpg'
          "
          style="height: calc(100vh + 90px)"
        >
          <div
            class="backdrop fit justify-center"
            align="center"
            style="margin-top: 1px"
          >
            <q-separator spaced inset vertical dark />
            <div
              style="background: linear-gradient(45deg, #d00, #00d)"
              class="row full-height"
            >
              <div
                class="text-white text-h1 text-center col col-xs-12 col-sm-12 col-md-12 col-lg-12"
                style="
                  font-variant: small-caps;
                  vertical-align: bottom;
                  margin-top: 25%;
                "
              >
                Aniims
              </div>
              <div
                class="text-white text-center text-h4 text-grey-2 rou col col-xs-12 col-sm-12 col-md-12 col-lg-12"
                style="
                  font-variant: small-caps;
                  border-radius: 4px;
                  margin-bottom: 20%;
                "
              >
                Advanced Nafdac Investigation Information Management System
              </div>
            </div>
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
          </div>
        </q-parallax>
        <div
          class="exortic-bg"
          align="center"
          style="background-attachment: fixed"
        >
          <div
            class="backdrop"
            :class="$q.screen.gt.sm ? 'q-pa-xl' : 'q-py-xl full-didth'"
          >
            <q-card
              flat
              class="my-card q-py-xl"
              :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'"
              :style="$q.screen.gt.xs ? 'width:75%;border-radius:8px' : ''"
            >
              <q-card-section>
                <div
                  class="text-h3 text-center q-py-md q-mt-xl"
                  style="
                    font-variant: small-caps;
                    opacity: 1;
                    border-bottom: 1px solid grey;
                  "
                >
                  Why are you here?
                </div>
              </q-card-section>
              <q-card-section align="" class="full-width">
                <div class="row q-col-gutter-xs">
                  <div
                    v-for="(item, i) of callToACtions"
                    :key="i"
                    class="col col-xs-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <q-card
                      class="full-width full-height"
                      :class="$q.dark.isActive ? 'bg-pink-10' : 'bg-grey-3'"
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
                                text-color=""
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
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <a href="about" name="about" id="about"></a>
        <div
          style="
            font-variant: small-caps;
            border: 0px solid grey;
            background: linear-gradient(45deg, #900, #009);
            margin-top: -4px;
          "
          :class="$q.dark.isActive ? 'bg-grey-10 text-grey-3' : 'text-'"
        >
          <q-card dark flat square class="bg-transparent">
            <q-card-section
              class="text-left q-mt-xs"
              style="border-radius: 4px"
            >
              <div
                class="text-h4 text-center q-py-sm q-my-xl"
                :style="myTweak($q.screen)"
              >
                <div
                  class="q-my-md q-mx-xl q-pb-md"
                  style="border-bottom: 1px solid"
                >
                  About Aniims
                </div>
                <AnimateOnScroll>
                  <q-card
                    flat
                    class="text-h5 text-justify q-mb-xl bg-transparent"
                    :class="$q.dark.isActive ? 'text-grey-3' : ''"
                    style="font-weight: 300; height: auto; border-radius: 16px"
                  >
                    <q-card-section>
                      The Aniims platform streamlines the processes, procedures
                      and operations of NAFDAC Investigation and Enforcement
                      Directorate with focus on automation, accuracy,
                      efficiency, reliability, data security, processing and
                      storage.
                    </q-card-section>
                    <q-card-section>
                      ABOUT NAFDAC<br />National Agency for Food and Drug
                      Administration and Control. NAFDAC is WHO ML 3 Certified.
                      Headquarters is located at Plot 234 Olusegun Obasanjo Way,
                      Gerki, Abuja, Nigeria NG, West Africa.
                      <q-separator spaced inset vertical dark />
                      <div class="text-body1">Email: nafdac@nafdac.gov.ng</div>
                    </q-card-section>
                  </q-card>
                </AnimateOnScroll>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <q-card
          square
          flat
          class="my-card q-pb-xl"
          :class="$q.dark.isActive ? 'bg-grey-10' : ''"
          style="
            border-top: 0px solid grey;
            background: linear-gradient(-45deg, red, #009);
          "
        >
          <div class="q-py-xl">
            <div name="form" id="form"></div>
          </div>

          <div class="q-pb-md" :style="myTweak($q.screen)">
            <div
              class="text-h4 text-center q-mb-sm q-pt-xl q-pb-sm"
              :class="$q.dark.isActive ? 'text-grey-2' : 'text-grey-2'"
              style="
                font-variant: small-caps;
                border-bottom: 1px solid;
                border-radius: 0px;
              "
            >
              Contact us
            </div>

            <div class="row q-col-gutter-md">
              <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-card dark flat square class="my-card-3 bg-transparent">
                  <q-card-section align="center">
                    <div class="text-h5">Have questions or complaints?</div>
                    <q-separator spaced inset vertical dark />
                    <div class="text-h6">
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
              <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <q-card
                  class="my-card"
                  :class="$q.dark.isActive ? 'bg-grey-9 shadow-0' : 'shadow-22'"
                >
                  <q-toolbar
                    class="text-white"
                    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-pink-8'"
                  >
                    <q-toolbar-title>
                      <div class="text-h6">Drop a message</div>
                    </q-toolbar-title>
                  </q-toolbar>
                  <q-card-section>
                    <q-intersection transition="scale">
                      <ContactForm buttonColor="pink" />
                    </q-intersection>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-card>
        <div
          class="row bg-blue-grey-"
          style="background: linear-gradient(90deg, #008, #009, #00a)"
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
        <transition
          appear
          enter-active-class="animated slideInDown duration:6s"
          leave-active-class="animated fadeOut"
        >
          <!-- Wrapping only one DOM element, defined by QBtn -->
          <q-page-sticky
            v-if="scrollInfo?.position > 22"
            position="top"
            :offset="[0, 0]"
            expand
          >
            <q-toolbar
              class="q-py-sm text-white"
              style="background: linear-gradient(45deg, #900, #00f)"
            >
              <q-toolbar-title class="small-caps">
                Aniims&trade;
              </q-toolbar-title>
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
        </transition>
        <q-page-scroller
          position="bottom-left"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn fab-mini icon="keyboard_arrow_up" color="accent" />
        </q-page-scroller>
      </q-page>
    </q-page-container>

    <q-footer>
      <div class="bg-blue-grey- q-pa-md text-grey-1 footer">
        Copyright &copy; {{ new Date().getFullYear() }}
        <span style="font-variant: small-caps"
          >Nafdac Investigation and Enforcement Directorate</span
        >
      </div>
    </q-footer>
  </q-layout>
</template>

<script script setup>
//import { Title } from "chart.js";
//import("https://unpkg.com/aos@2.3.1/dist/aos.js");
import { ref } from "vue";
import AnimateOnScroll from "src/components/AnimateOnScroll.vue";
import FooterMenuCard from "src/components/FooterMenuCard.vue";
import ContactForm from "src/components/forms/ContactForm.vue";
//import * as sql from "../plugins/sequelize";

//import "https://unpkg.com/sequelize-browser@6.x/sequelize.script.js";

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
    icon: "phone",
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
  document.getElementById("form").scrollIntoView();
}
function goToAbout() {
  document.getElementById("about").scrollIntoView({
    behavior: "smooth",
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
  background: rgba(000, 000, 000, 0.7);
}
@media only screen and (max-width: 900px) {
  .my-card-2 .my-card-child {
    margin-top: 0px;
  }
}
</style>
